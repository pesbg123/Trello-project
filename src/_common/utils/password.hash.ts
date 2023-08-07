import * as bcrypt from 'bcrypt';
import { SignupDto } from '../dtos/signup.dto';

export const transfomrPassword = async (body: SignupDto): Promise<void> => {
  body.password = await bcrypt.hash(body.password, 10);
  return Promise.resolve();
};
