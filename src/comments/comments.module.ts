import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../_common/entities/comment.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { BoardsService } from 'src/boards/boards.service';
import { Project } from 'src/_common/entities/project.entity';
import { Board } from 'src/_common/entities/board.entity';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';
import { MailService } from 'src/mail/mail.service';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Project, ProjectMember, Board, BoardColumn])],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, AccessAuthGuard, UsersService, ProjectsService, BoardsService, MailService],
})
export class CommentsModule {}
