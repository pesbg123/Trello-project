import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  sign(payload: Record<any, any>, expiresIn: string) {
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn });
  }

  verify(token: string) {
    try {
      const verify = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

      if (verify) {
        console.log(this.decode(token));
        return this.decode(token);
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  decode(token: string) {
    return jwt.decode(token);
  }
}
