import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/_common/entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NestjsFormDataModule],
  exports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
