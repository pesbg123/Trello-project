import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './_common/orm.config';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRootAsync({ useFactory: ormConfig }), UsersModule, JwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
