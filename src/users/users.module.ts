import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/_common/entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { UploadMiddleware } from 'src/_common/middlewares/uploadMiddleware';
import { EventsModule } from 'src/events/events.module';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EventsModule],
  exports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({ path: '/users/signup', method: RequestMethod.POST }, { path: '/users', method: RequestMethod.PATCH });
    consumer.apply(TokenValidMiddleware).forRoutes(UsersController);
  }
}
