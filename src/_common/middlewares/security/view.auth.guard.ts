import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { IRequest } from '../../interfaces/request.interface';
import { IRefreshTokenCacheData } from '../../interfaces/refresh.cache.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    return this.validate(request, response);
  }

  async validate(request: IRequest, response: Response): Promise<any> {
    const requestAccessToken = request.cookies.accessToken;

    if (!requestAccessToken) return response.redirect('/login');
    const accessVerifyErrorHandle = this.jwtService.verifyErrorHandle(requestAccessToken, process.env.ACCESS_SECRET_KEY);
    if (accessVerifyErrorHandle !== 'jwt normal') return response.redirect('/login');

    return true;
  }
}
