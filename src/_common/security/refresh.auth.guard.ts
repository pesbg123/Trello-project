import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { IRequest } from '../interfaces/request.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IRefreshPayload } from '../interfaces/refresh.payload.interface';
import { IRefreshTokenCacheData } from '../interfaces/refresh.cache.interface';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(private usersService: UsersService, private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validate(request);
  }

  async validate(request) {
    const requestAccessToken = request.headers.authorization.replace('Bearer ', '') || null;
    const requestRefreshToken = request.cookies.refreshToken.replace('Bearer ', '') || null;

    /** 리프레시 토큰 유효성 검증 */
    this.jwtService.verify(requestRefreshToken, process.env.REFRESH_SECRET_KEY);

    /** 캐시 메모리에 저장된 토큰 유효성 검증 */
    const cacheValid: IRefreshTokenCacheData = await this.cacheManager.get(requestRefreshToken);
    if (!cacheValid) throw new UnauthorizedException();

    /** 액세스 토큰 유효성 검증 */
    const accessVerifyErrorHandle = this.jwtService.verifyErrorHandle(requestAccessToken, process.env.ACCESS_SECRET_KEY);
    if (cacheValid.accessToken !== requestAccessToken || accessVerifyErrorHandle == 'jwt nomal') {
      await this.cacheManager.del(requestRefreshToken);
      throw new UnauthorizedException();
    }

    return true;
  }
}
