import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

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
      throw new UnauthorizedException(error.message);
    }
  }

  verifyErrorHandle(token: string, secretKey: string): string {
    try {
      const verify = jwt.verify(token, secretKey);

      if (verify) {
        return 'jwt nomal';
      }
    } catch (error) {
      return error.message;
    }
  }

  decode(token: string) {
    return jwt.decode(token, { json: true });
  }
}
