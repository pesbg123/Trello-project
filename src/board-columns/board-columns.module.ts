import { Module } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { BoardColumnsController } from './board-columns.controller';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/_common/entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { accessAuthGuard } from 'src/_common/security/access.auth.guard';
import { Project } from 'src/_common/entities/project.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn, User, Project, ProjectMember])],
  providers: [BoardColumnsService, JwtService, accessAuthGuard, UsersService, ProjectsService],
  controllers: [BoardColumnsController],
})
export class BoardColumnsModule {}
