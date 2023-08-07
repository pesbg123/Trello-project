import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { User } from 'src/_common/entities/user.entity';
import { IToken } from 'src/_common/interfaces/Token.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { validatePassword } from 'src/_common/utils/password.compare';
import { transfomrPassword } from 'src/_common/utils/password.hash';

import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

  /** 회원가입 */
  async signup(body: SignupDto): Promise<IMessage> {
    const emailExists: User = await this.userRepository.findOne({ where: { email: body.email } });
    if (emailExists) throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.BAD_REQUEST);
    await transfomrPassword(body);
    await this.userRepository.save(body);
    return { message: '회원가입이 완료되었습니다.' };
  }

  async login(body: LoginDto): Promise<IToken> {
    const findByUser: User = await this.userRepository.findOne({ where: { email: body.email } });
    const validPassword = await validatePassword(findByUser.password, body.password);

    if (!findByUser || !validPassword) throw new UnauthorizedException('이메일과 패스워드를 확인해 주세요.');

    const accessToken = this.jwtService.sign(
      { id: findByUser.id },
      { secret: process.env.ACCESS_SECRET_KEY, expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME },
    );

    await this.userRepository.update({ id: findByUser.id }, { token: accessToken });

    return {
      accessToken: this.jwtService.sign(
        { id: findByUser.id },
        { secret: process.env.ACCESS_SECRET_KEY, expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME },
      ),
    };
  }
}
