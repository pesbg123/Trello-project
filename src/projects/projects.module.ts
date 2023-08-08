import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/_common/entities/project.entity';
import { ConfigModule } from '@nestjs/config';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember]), ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
