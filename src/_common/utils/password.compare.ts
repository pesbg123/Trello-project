import * as bcrypt from 'bcrypt';

export const validatePassword = async (findByPassword: string, password: string): Promise<boolean> => {
  return await bcrypt.compare(password, findByPassword);
};
