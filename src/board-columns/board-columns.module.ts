import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { BoardColumnsController } from './board-columns.controller';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { Project } from 'src/_common/entities/project.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';
import { MailService } from 'src/mail/mail.service';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn, User, Project, ProjectMember])],
  providers: [BoardColumnsService, JwtService, AccessAuthGuard, UsersService, ProjectsService, MailService],
  controllers: [BoardColumnsController],
})
export class BoardColumnsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(BoardColumnsController);
  }
}
