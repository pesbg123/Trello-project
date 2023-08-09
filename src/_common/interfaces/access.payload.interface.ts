import * as jwt from 'jsonwebtoken';

export interface IAccessPayload extends jwt.JwtPayload {
  id: number;
  name: string;
  email: string;
}
