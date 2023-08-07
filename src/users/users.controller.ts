import { Body, Controller, Post } from '@nestjs/common';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { UsersService } from './users.service';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { IResult } from 'src/_common/interfaces/result.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<IMessage> {
    /** 프로필 사진 추가, body값 중에 password, confirmPassword 일치여부 체크 Pipe 필요  */
    return await this.usersService.signup(body);
  }
}
