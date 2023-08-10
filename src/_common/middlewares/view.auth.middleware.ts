import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest } from '../interfaces/request.interface';
import { NextFunction, Response } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ViewAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}
  async use(req: IRequest, res: Response, next: NextFunction) {
    const requestAccessToken = req.cookies.accessToken;
    const requestRefreshToken = req.cookies.refreshToken;

    const accessTokenVerify = this.jwtService.verifyErrorHandle(requestAccessToken, process.env.ACCESS_SECRET_KEY);
    if (accessTokenVerify == 'jwt normal') return next();

    const refreshTokenVerifyErrorHandle = this.jwtService.verifyErrorHandle(requestRefreshToken, process.env.REFRESH_SECRET_KEY);
    if (refreshTokenVerifyErrorHandle == 'jwt normal') {
      const refreshPayload = this.jwtService.verify(requestRefreshToken, process.env.REFRESH_SECRET_KEY);
      const findByUser = await this.usersService.tokenValidateUser(refreshPayload);

      const accessToken = this.jwtService.sign(
        { id: findByUser.id, name: findByUser.name, email: findByUser.email, imageUrl: findByUser.imageUrl },
        process.env.ACCESS_SECRET_KEY,
        process.env.JWT_ACCESS_EXPIRATION_TIME,
      );

      res.cookie('accessToken', accessToken);
      return res.redirect(req.url);
    }

    return res.redirect('/login');
  }
}
