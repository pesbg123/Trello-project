import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { Response } from 'express';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { AccessAuthGuard } from 'src/_common/security/access.auth.guard';
import { User } from 'src/_common/entities/user.entity';
import { EditProfileDto } from 'src/_common/dtos/editProfile.dto';
import { EditPasswordDto } from 'src/_common/dtos/editPassword.dto';
import { RefreshAuthGuard } from 'src/_common/security/refresh.auth.guard';
import { IAccessToken } from 'src/_common/interfaces/accessToken.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() body: SignupDto, @Req() req: IRequest): Promise<IResult> {
    /** 프로필 사진 추가 필요  */
    const imageUrl = req.file ? req.file.location : null;
    return await this.usersService.signup(body, imageUrl);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    const { accessToken, refreshToken } = await this.usersService.login(body);
    res.cookie('refreshToken', refreshToken);
    //{ httpOnly: true }
    return res.json({ accessToken });
  }

  @Delete('logout')
  @UseGuards(AccessAuthGuard)
  async logout(@Req() req: IRequest): Promise<IResult> {
    const { refreshToken } = req.body;
    return await this.usersService.logout(refreshToken);
  }

  @Get()
  @UseGuards(AccessAuthGuard)
  async profile(@Req() req: IRequest): Promise<User> {
    const { id } = req.user;
    return await this.usersService.profile(id);
  }

  @Patch()
  @UseGuards(AccessAuthGuard)
  async editProfile(@Req() req: IRequest, @Body() editData: EditProfileDto): Promise<IResult> {
    /** 프로필 사진 추가 필요  */
    const { id } = req.user;
    return await this.usersService.editProfile(id, editData);
  }

  @Patch('password')
  @UseGuards(AccessAuthGuard)
  async editPassword(@Req() req: IRequest, @Body() editPassword: EditPasswordDto): Promise<IResult> {
    const user = req.user;
    return await this.usersService.editPassword(user, editPassword);
  }

  @Post('refreshtoken')
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Req() req: IRequest): Promise<IAccessToken> {
    const { refreshToken } = req.body;
    const { accessToken } = await this.usersService.refreshToken(refreshToken);
    return { accessToken };
  }
}
