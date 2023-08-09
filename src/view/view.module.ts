import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [ViewController],
  providers: [ViewService, JwtService],
})
export class ViewModule {}
