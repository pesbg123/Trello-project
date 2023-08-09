import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get()
  @Render('index.ejs')
  async test() {
    return { name: '심재두' };
  }
}
