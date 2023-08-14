import * as bcrypt from 'bcrypt';

export const transfomrPassword = async (body: any): Promise<void> => {
  if (body?.password) {
    body.password = await bcrypt.hash(body.password, 10);
  } else {
    body.newPassword = await bcrypt.hash(body.newPassword, 10);
  }
  return Promise.resolve();
};
