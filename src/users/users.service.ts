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
import { IAccessPayload } from 'src/_common/interfaces/access.payload.interface';
import { RemoveUserDto } from 'src/_common/dtos/removeUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /** 회원가입 */
  async signup(body: SignupDto, imageUrl: string): Promise<IResult> {
    const emailExists = await this.userRepository.findOne({ where: { email: body.email } });
    if (emailExists) throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.BAD_REQUEST);
    await transfomrPassword(body);
    await this.userRepository.save({ ...body, imageUrl });
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

    return { accessToken, refreshToken };
  }

  /** 로그아웃 */
  logout(): IResult {
    return { result: true };
  }

  /** 토큰 값 실제 사용자 유효성 검증 */
  async tokenValidateUser(payload: any): Promise<User> {
    return await this.userRepository.findOne({ where: { id: payload.id } });
  }

  /** 사용자 정보 조회 */
  async profile(user: IAccessPayload): Promise<IAccessPayload> {
    // const result = await this.userRepository.findOne({ where: { id } });
    return user.imageUrl
      ? { id: user.id, name: user.name, email: user.email, imageUrl: user.imageUrl }
      : {
          id: user.id,
          name: user.name,
          email: user.email,
          imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        };
  }

  /** 회원 탈퇴 */
  async removeUser(id: number, password: RemoveUserDto): Promise<IResult> {
    const findByUser = await this.userRepository.findOne({ where: { id } });
    const validPassword = await validatePassword(findByUser.password, password.password);
    if (!validPassword) throw new HttpException('패스워드가 일치하지 않습니다.', 403);

    await this.userRepository.delete({ id });

    return { result: true };
  }

  /** 사용자 정보 수정 */
  async editProfile(id: number, editData: EditProfileDto, imageUrl: string): Promise<IAccessToken> {
    await this.userRepository.update({ id }, { ...editData, imageUrl });
    const findByUser = await this.userRepository.findOne({ where: { id } });
    const accessToken = this.jwtService.sign(
      { id: findByUser.id, name: findByUser.name, email: findByUser.email, imageUrl: findByUser.imageUrl },
      process.env.ACCESS_SECRET_KEY,
      process.env.JWT_ACCESS_EXPIRATION_TIME,
    );

    return { accessToken };
  }

  /** 사용자 패스워드 수정 */
  async editPassword(id: number, editPassword: EditPasswordDto): Promise<IResult> {
    const findByUser = await this.userRepository.findOne({ where: { id } });

    const validPassword = await validatePassword(findByUser.password, editPassword.oldPassword);
    if (!validPassword) throw new HttpException('현재 패스워드가 일치하지 않습니다.', 403);

    const validNewPassword = await validatePassword(findByUser.password, editPassword.newPassword);
    if (validNewPassword) throw new HttpException('신규 패스워드와 현재 패스워드가 동일합니다.', 403);

    await transfomrPassword(editPassword);

    await this.userRepository.update({ id }, { password: editPassword.newPassword });
    return { result: true };
  }

  async findUser(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new HttpException('존재하지 않는 유저입니다.', HttpStatus.NOT_FOUND);
    return user.id;
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
