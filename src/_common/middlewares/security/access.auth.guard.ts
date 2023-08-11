import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { IRequest } from '../../interfaces/request.interface';

@Injectable()
export class AccessAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validate(request);
  }

  async validate(request) {
    const requestAccessToken = request.cookies.accessToken;

    /** 토큰 유효성 검증 */
    const payload = this.jwtService.verify(requestAccessToken, process.env.ACCESS_SECRET_KEY);

    request.user = payload;

    return true;
  }
}
