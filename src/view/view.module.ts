import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { JwtService } from 'src/jwt/jwt.service';
import { ViewAuthMiddleware } from 'src/_common/middlewares/view.auth.middleware';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/_common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ViewController],
  providers: [ViewService, JwtService, UsersService],
})
export class ViewModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ViewAuthMiddleware).forRoutes(ViewController);
  }
}
