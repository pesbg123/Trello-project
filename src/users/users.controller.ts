import { Body, Controller, Delete, Get, Patch, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from 'src/_common/dtos/signup.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { LoginDto } from 'src/_common/dtos/login.dto';
import { Response } from 'express';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { User } from 'src/_common/entities/user.entity';
import { EditProfileDto } from 'src/_common/dtos/editProfile.dto';
import { EditPasswordDto } from 'src/_common/dtos/editPassword.dto';
import { IAccessPayload } from 'src/_common/interfaces/access.payload.interface';
import { RemoveUserDto } from 'src/_common/dtos/removeUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() body: SignupDto, @Req() req: IRequest): Promise<IResult> {
    const imageUrl = req.file?.location;
    return await this.usersService.signup(body, imageUrl);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    const { accessToken, refreshToken } = await this.usersService.login(body);
    res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);
    //{ httpOnly: true }
    return res.json({ result: true });
  }

  @Delete('logout')
  @UseGuards(AccessAuthGuard)
  logout(@Req() req: IRequest, @Res() res: Response): Response {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    const result = this.usersService.logout();
    return res.json(result);
  }

  @Get()
  @UseGuards(AccessAuthGuard)
  async profile(@Req() req: IRequest): Promise<IAccessPayload> {
    const user: IAccessPayload = req.user;
    return this.usersService.profile(user);
  }

  @Delete()
  @UseGuards(AccessAuthGuard)
  async removeUser(@Req() req: IRequest, @Body() password: RemoveUserDto, @Res() res: Response): Promise<Response> {
    const { id } = req.user;
    const result = await this.usersService.removeUser(id, password);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json(result);
  }

  @Patch()
  @UseGuards(AccessAuthGuard)
  @UsePipes(ValidationPipe)
  async editProfile(@Req() req: IRequest, @Res() res: Response, @Body() editData: EditProfileDto): Promise<Response> {
    const { id } = req.user;
    const imageUrl = req.file?.location;
    const { accessToken } = await this.usersService.editProfile(id, editData, imageUrl);
    res.cookie('accessToken', accessToken);
    return res.json({ result: true });
  }

  @Patch('password')
  @UseGuards(AccessAuthGuard)
  async editPassword(@Body() editPassword: EditPasswordDto, @Req() req: IRequest, @Res() res: Response): Promise<Response> {
    const { id } = req.user;
    const result = await this.usersService.editPassword(id, editPassword);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json(result);
  }

  @Get('search')
  @UseGuards(AccessAuthGuard)
  async searchUserByEmail(@Query('email') email: string): Promise<User[]> {
    return await this.usersService.searchUserByEmail(email);
  }
}
