import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../_common/entities/comment.entity';
import { User } from 'src/_common/entities/user.entity';
import { AccessAuthGuard } from 'src/_common/security/access.auth.guard';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User])],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, AccessAuthGuard, UsersService],
})
export class CommentsModule {}
