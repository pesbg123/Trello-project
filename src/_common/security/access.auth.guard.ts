import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class accessAuthGuard implements CanActivate {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    /** return boolean 형식이며, true일 경우 가드 통과, 아닌경우 403 인가실패 */
    return this.validate(request);
  }

  async validate(request) {
    const requestAccessToken = request.headers.authorization.replace('Bearer ', '');

    /** 토큰 유효성 검증 */
    const payload = this.jwtService.verify(requestAccessToken);

    /** 사용자 유효성 검증 및 DB에 등록된 토큰과 일치여부 검증 */
    const findByUser = await this.usersService.tokenValidateUser(payload);
    if (!findByUser || findByUser.token !== requestAccessToken) throw new UnauthorizedException();

    return true;
  }
}
