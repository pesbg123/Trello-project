import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from 'src/_common/entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadMiddleware } from 'src/_common/middlewares/uploadMiddleware';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';
import { Project } from 'src/_common/entities/project.entity';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { MailService } from 'src/mail/mail.service';
import { BoardColumnsService } from 'src/board-columns/board-columns.service';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, User, Project, ProjectMember, BoardColumn])],
  controllers: [BoardsController],
  providers: [BoardsService, JwtService, AccessAuthGuard, UsersService, ProjectsService, MailService, BoardColumnsService],
  exports: [BoardsService],
})
export class BoardsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes(
        { path: '/projects/:projectId/:columnId/boards', method: RequestMethod.POST },
        { path: '/projects/:projectId/boards/:boardId', method: RequestMethod.PATCH },
      );
  }
}
