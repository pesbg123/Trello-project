import { Injectable } from '@nestjs/common';
import { IAccessPayload } from 'src/_common/interfaces/access.payload.interface';

@Injectable()
export class ViewService {
  async header(user: IAccessPayload) {
    if (user) {
      return {
        isLogin: true,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      };
    }

    return {
      isLogin: false,
    };
  }
}
