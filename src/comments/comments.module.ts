import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/_common/entities/comment.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User])],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, AccessAuthGuard, UsersService],
})
export class CommentsModule {}
