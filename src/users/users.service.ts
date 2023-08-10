import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditPasswordDto } from 'src/_common/dtos/editPassword.dto';
import { EditProfileDto } from 'src/_common/dtos/editProfile.dto';
import { EmailDTO } from 'src/_common/dtos/email.dto';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { User } from 'src/_common/entities/user.entity';
import { IToken } from 'src/_common/interfaces/Token.interface';
import { IResult } from 'src/_common/interfaces/result.interface';
import { validatePassword } from 'src/_common/utils/password.compare';
import { transfomrPassword } from 'src/_common/utils/password.hash';
import { In, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from 'src/jwt/jwt.service';
import { IAccessToken } from 'src/_common/interfaces/accessToken.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
    if (!findByUser) throw new UnauthorizedException('이메일과 패스워드를 확인해주세요.');
    const validPassword = await validatePassword(findByUser.password, body.password);
    if (!validPassword) throw new UnauthorizedException('이메일과 패스워드를 확인해주세요.');

    const accessToken = this.jwtService.sign(
      { id: findByUser.id, name: findByUser.name, email: findByUser.email, imageUrl: findByUser.imageUrl },
      process.env.ACCESS_SECRET_KEY,
      process.env.JWT_ACCESS_EXPIRATION_TIME,
    );
    const refreshToken = this.jwtService.sign({ id: findByUser.id }, process.env.REFRESH_SECRET_KEY, process.env.JWT_REFRESH_EXPIRATION_TIME);
    await this.cacheManager.set(refreshToken, { accessToken, id: findByUser.id }, Number(process.env.REFRESH_CACHE_TIME));

    return { accessToken, refreshToken };
  }

  /** 로그아웃 */
  async logout(refreshToken: string): Promise<IResult> {
    await this.cacheManager.del(refreshToken);
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

  async findUser(email: string): Promise<any> {
    const { id } = await this.userRepository.findOne({ where: { email } });
    return id;
  }
  /** 토큰 재발급 */
  async refreshToken(refreshToken: string): Promise<IAccessToken> {
    const { id } = this.jwtService.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const findByUser = await this.userRepository.findOne({ where: { id } });

    const accessToken = this.jwtService.sign(
      { id: findByUser.id, name: findByUser.name, email: findByUser.email },
      process.env.ACCESS_SECRET_KEY,
      process.env.JWT_ACCESS_EXPIRATION_TIME,
    );

    await this.cacheManager.set(refreshToken, { accessToken, id: findByUser.id }, Number(process.env.REFRESH_CACHE_TIME));

    return { accessToken };
  }

  async searchUserByEmail(email: string): Promise<User[]> {
    const user = await this.userRepository.find({ where: { email }, select: ['id', 'email', 'name', 'imageUrl'] });

    if (!user) throw new HttpException('해당 이메일을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    return user;
  }
}
