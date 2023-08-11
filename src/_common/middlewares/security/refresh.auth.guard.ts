import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { IRequest } from '../../interfaces/request.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IRefreshPayload } from '../../interfaces/refresh.payload.interface';
import { IRefreshTokenCacheData } from '../../interfaces/refresh.cache.interface';
import { Response } from 'express';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(private usersService: UsersService, private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    return this.validate(request, response);
  }

  async validate(request, response) {
    const requestAccessToken = request.cookies.accessToken;
    const requestRefreshToken = request.cookies.refreshToken;

    this.jwtService.verify(requestRefreshToken, process.env.REFRESH_SECRET_KEY);

    const accessVerifyErrorHandle = this.jwtService.verifyErrorHandle(requestAccessToken, process.env.ACCESS_SECRET_KEY);
    if (accessVerifyErrorHandle == 'jwt nomal') {
      response.clearCookie('refreshToken');
      response.clearCookie('accessToken');
    }

    return true;
  }
}
