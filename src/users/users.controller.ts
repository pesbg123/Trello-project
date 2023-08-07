import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { UsersService } from './users.service';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { Request, Response } from 'express';
import { IToken } from 'src/_common/interfaces/Token.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { accessAuthGuard } from 'src/_common/security/access.auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<IMessage> {
    /** 프로필 사진 추가, body값 중에 password, confirmPassword 일치여부 체크 Pipe 필요  */
    return await this.usersService.signup(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    const { accessToken } = await this.usersService.login(body);
    res.setHeader('Authorization', 'bearer ' + accessToken);
    return res.json({ accessToken });
  }

  @Delete('logout')
  async logout(@Req() req: IRequest): Promise<IResult> {
    const { id } = req.user;
    return await this.usersService.logout(id);
  }

  @Get('test')
  @UseGuards(accessAuthGuard)
  test() {
    return 'test';
  }
}
