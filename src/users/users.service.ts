import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/_common/entities/user.entity';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { IResult } from 'src/_common/interfaces/result.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async signup(body): Promise<IMessage> {
    await this.userRepository.save(body);
    return { message: '회원가입이 완료되었습니다.' };
  }
}
