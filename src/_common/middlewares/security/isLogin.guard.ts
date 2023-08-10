import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { IRequest } from '../../interfaces/request.interface';
import { IRefreshTokenCacheData } from '../../interfaces/refresh.cache.interface';
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
    const requestAccessToken = request.cookies.accessToken;

    if (requestAccessToken) {
      const accessVerifyErrorHandle = this.jwtService.verifyErrorHandle(requestAccessToken, process.env.ACCESS_SECRET_KEY);
      if (accessVerifyErrorHandle === 'jwt normal') {
        const payload = this.jwtService.verify(requestAccessToken, process.env.ACCESS_SECRET_KEY);
        request.user = payload;
      }
    }
    return true;
  }
}
