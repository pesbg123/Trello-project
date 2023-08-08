import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditPasswordDto } from 'src/_common/dtos/editPassword.dto';
import { EditProfileDto } from 'src/_common/dtos/editProfile.dto';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { User } from 'src/_common/entities/user.entity';
import { IToken } from 'src/_common/interfaces/Token.interface';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { Payload } from 'src/_common/interfaces/payload.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { IResult } from 'src/_common/interfaces/result.interface';
import { validatePassword } from 'src/_common/utils/password.compare';
import { transfomrPassword } from 'src/_common/utils/password.hash';
import { JwtService } from 'src/jwt/jwt.service';

import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

  /** 회원가입 */
  async signup(body: SignupDto): Promise<IResult> {
    const emailExists = await this.userRepository.findOne({ where: { email: body.email } });
    if (emailExists) throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.BAD_REQUEST);
    await transfomrPassword(body);
    await this.userRepository.save(body);
    return { result: true };
  }

  /** 로그인 */
  async login(body: LoginDto): Promise<IToken> {
    const findByUser = await this.userRepository.findOne({ where: { email: body.email } });
    const validPassword = await validatePassword(findByUser.password, body.password);

    const remainingToken = findByUser.token;

    if (remainingToken) {
      const verifyErrorHandle = this.jwtService.verifyErrorHandle(remainingToken);
      if (verifyErrorHandle !== 'jwt expired') throw new UnauthorizedException('이미 로그인된 계정입니다.');
    }

    if (!findByUser || !validPassword) throw new UnauthorizedException('이메일과 패스워드를 확인해 주세요.');

    const accessToken = this.jwtService.sign({ id: findByUser.id }, process.env.JWT_ACCESS_EXPIRATION_TIME);
    await this.userRepository.update({ id: findByUser.id }, { token: accessToken });

    return {
      accessToken: this.jwtService.sign({ id: findByUser.id }, process.env.JWT_ACCESS_EXPIRATION_TIME),
    };
  }

  /** 로그아웃 */
  async logout(id: number): Promise<IResult> {
    await this.userRepository.update({ id }, { token: null });
    return { result: true };
  }

  /** 토큰 값 실제 사용자 유효성 검증 */
  async tokenValidateUser(payload: any): Promise<User> {
    return await this.userRepository.findOne({ where: { id: payload.id } });
  }

  /** 사용자 정보 조회 */
  async profile(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id }, select: { email: true, name: true, createdAt: true } });
  }

  /** 사용자 정보 수정 */
  async editProfile(id: number, editData: EditProfileDto): Promise<IResult> {
    await this.userRepository.update({ id }, editData);
    return { result: true };
  }

  /** 사용자 패스워드 수정 */
  async editPassword(user: User, editPassword: EditPasswordDto): Promise<IResult> {
    if (user.password == editPassword.password) throw new BadRequestException('현재 사용중인 패스워드입니다.');
    await transfomrPassword(editPassword);
    await this.userRepository.update({ id: user.id }, { password: editPassword.password });
    return { result: true };
  }
}
