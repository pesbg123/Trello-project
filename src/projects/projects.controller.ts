import { Controller, Post, Body, Res, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDTO } from './dto/project.dto';
import { Response, Request } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Post()
  createProject(@Body(ValidationPipe) projectDTO: ProjectDTO, @Res() res: Response): Object {
    return res.status(HttpStatus.CREATED).json({ message: '프로젝트가 생성되었습니다.' });
  }
}
