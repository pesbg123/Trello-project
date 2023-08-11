import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
    if (!request.user) throw new UnauthorizedException('로그인이 필요합니다.');
    return true;
  }
}
