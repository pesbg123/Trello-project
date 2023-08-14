import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { throwIfEmpty } from 'rxjs';

@Injectable()
export class JwtService {
  sign(payload: Record<any, any>, secretKey: string, expiresIn: string): string {
    return jwt.sign(payload, secretKey, { expiresIn });
  }

  verify(token: string, secretKey: string) {
    try {
      const verify = jwt.verify(token, secretKey, { complete: true });

      if (verify) {
        return this.decode(token);
      }
    } catch (error) {
      return error.message;
    }
  }

  verifyErrorHandle(token: string, secretKey: string): string {
    try {
      const verify = jwt.verify(token, secretKey);

      if (verify) {
        return this.decodeErrorHandle(token);
      }
    } catch (error) {
      return error.message;
    }
  }

  decode(token: string) {
    return jwt.decode(token, { json: true });
  }

  decodeErrorHandle(token: string): string {
    try {
      const decode = jwt.decode(token, { json: true });
      if (decode) {
        return 'jwt normal';
      }
    } catch (error) {
      return error.message;
    }
  }
}
