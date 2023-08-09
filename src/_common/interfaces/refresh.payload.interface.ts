import * as jwt from 'jsonwebtoken';

export interface IRefreshPayload extends jwt.JwtPayload {
  id?: number;
  refreshToken?: string;
}
