import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { IRequest } from '../interfaces/request.interface';
import { IRefreshTokenCacheData } from '../interfaces/refresh.cache.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class IsLogin implements CanActivate {
  constructor(private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validate(request);
  }

  async validate(request) {
    const requestRefreshToken = request.cookies.refreshToken || null;

    if (requestRefreshToken) {
      /** 캐시 메모리에 저장된 리프레시 토큰 유효성 검증 */
      const cacheValid: IRefreshTokenCacheData = await this.cacheManager.get(requestRefreshToken);
      if (cacheValid) {
        const accessVerifyErrorHandle = this.jwtService.verifyErrorHandle(cacheValid.accessToken, process.env.ACCESS_SECRET_KEY);

        if (accessVerifyErrorHandle === 'jwt nomal') {
          const payload = this.jwtService.verify(cacheValid.accessToken, process.env.ACCESS_SECRET_KEY);
          request.user = payload;
        }
      }
    }

    return true;
  }
}
