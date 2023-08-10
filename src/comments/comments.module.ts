import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../_common/entities/comment.entity';
import { ProjectsModule } from '../projects/projects.module';

// import { ProjectMember } from '../_common/entities/projectMember.entity';
// import { Board } from '../_common/entities/board.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessAuthGuard } from 'src/_common/security/access.auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User]), ProjectsModule],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, AccessAuthGuard, UsersService],
})
export class CommentsModule {}
