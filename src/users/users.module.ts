import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/_common/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from 'src/jwt/jwt.service';
import { redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
