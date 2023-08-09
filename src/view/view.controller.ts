import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get()
  @Render('test.ejs')
  async test() {
    return { name: '심재두' };
  }
}
