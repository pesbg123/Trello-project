import * as bcrypt from 'bcrypt';

export const transfomrPassword = async (body: any): Promise<void> => {
  body.password = await bcrypt.hash(body.password, 10);
  return Promise.resolve();
};
