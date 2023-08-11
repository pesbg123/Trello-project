import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { ViewService } from './view.service';
import { Request } from 'express';
import { IAccessPayload } from 'src/_common/interfaces/access.payload.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { ViewAuthGuard } from 'src/_common/middlewares/security/view.auth.guard';

@Controller()
export class ViewController {
  constructor(private viewService: ViewService) {}

  /** headers */
  @Get()
  @Render('index.ejs')
  async index(@Req() req: IRequest) {
    const user: IAccessPayload = req.user;
    const header = await this.viewService.header(user);
    return { title: 'IDLE', subtitle: '대시보드', header };
  }

  @Get('myprofile')
  @UseGuards(ViewAuthGuard)
  @Render('myprofile.ejs')
  async myProfile(@Req() req: IRequest) {
    const user: IAccessPayload = req.user;
    const header = await this.viewService.header(user);
    return { title: 'IDLE', subtitle: '프로필', header };
  }

  @Get('project-register')
  @UseGuards(ViewAuthGuard)
  @Render('project-register.ejs')
  async projectRegister(@Req() req: IRequest) {
    const user: IAccessPayload = req.user;
    const header = await this.viewService.header(user);

    return { title: 'IDLE', subtitle: '프로젝트 등록', header };
  }

  /** No headers */
  @Get('login')
  @Render('login.ejs')
  async login() {
    return { title: 'IDLE', subtitle: '로그인' };
  }

  @Get('signup')
  @Render('signup.ejs')
  async signup() {
    return { title: 'IDLE', subtitle: '회원가입' };
  }
}
