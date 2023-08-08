import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { UsersService } from './users.service';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { Request, Response } from 'express';
import { IToken } from 'src/_common/interfaces/Token.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { accessAuthGuard } from 'src/_common/security/access.auth.guard';
import { User } from 'src/_common/entities/user.entity';
import { EditProfileDto } from 'src/_common/dtos/editProfile.dto';
import { EditPasswordDto } from 'src/_common/dtos/editPassword.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<IResult> {
    /** 프로필 사진 추가 필요  */
    return await this.usersService.signup(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    const { accessToken } = await this.usersService.login(body);
    res.setHeader('Authorization', 'bearer ' + accessToken);
    return res.json({ accessToken });
  }

  @Delete('logout')
  @UseGuards(accessAuthGuard)
  async logout(@Req() req: IRequest): Promise<IResult> {
    const { id } = req.user;
    return await this.usersService.logout(id);
  }

  @Get()
  @UseGuards(accessAuthGuard)
  async profile(@Req() req: IRequest): Promise<User> {
    const { id } = req.user;
    return await this.usersService.profile(id);
  }

  @Patch()
  @UseGuards(accessAuthGuard)
  async editProfile(@Req() req: IRequest, @Body() editData: EditProfileDto): Promise<IResult> {
    /** 프로필 사진 추가 필요  */
    const { id } = req.user;
    return await this.usersService.editProfile(id, editData);
  }

  @Patch('password')
  @UseGuards(accessAuthGuard)
  async editPassword(@Req() req: IRequest, @Body() editPassword: EditPasswordDto): Promise<IResult> {
    const user = req.user;
    return await this.usersService.editPassword(user, editPassword);
  }
}
