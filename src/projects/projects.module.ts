import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/_common/entities/project.entity';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { TokenValidMiddleware } from 'src/_common/middlewares/token.valid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtService, AccessAuthGuard, UsersService, MailService],
})
export class ProjectsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidMiddleware).forRoutes(ProjectsController);
  }
}
