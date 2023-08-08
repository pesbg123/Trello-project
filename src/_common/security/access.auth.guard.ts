import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { IRequest } from '../interfaces/request.interface';

@Injectable()
export class accessAuthGuard implements CanActivate {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validate(request);
  }

  async validate(request) {
    const requestAccessToken = request.headers.authorization.replace('Bearer ', '');

    /** 토큰 유효성 검증 */
    const payload = this.jwtService.verify(requestAccessToken);

    /** 사용자 유효성 검증 및 DB에 등록된 토큰과 일치여부 검증 */
    const findByUser = await this.usersService.tokenValidateUser(payload);
    if (!findByUser || findByUser.token !== requestAccessToken) throw new UnauthorizedException();

    //무조건 한번은 DB에 접근을 해야하기때문에 비용적인면에서 불리한편으로 캐시를 사용할 수 있도록 레디스를 사용할 예정

    request.user = findByUser;

    return true;
  }
}
