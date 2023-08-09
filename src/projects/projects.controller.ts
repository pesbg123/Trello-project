import { Controller, Post, Body, Res, ValidationPipe, HttpStatus, Get, Param, UseGuards, Req, Patch, HttpException, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDTO } from '../_common/dtos/project.dto';
import { Response, Request } from 'express';
import { accessAuthGuard } from 'src/_common/security/access.auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { EmailDTO } from 'src/_common/dtos/email.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @UseGuards(accessAuthGuard)
  async createProject(@Body(ValidationPipe) projectDTO: ProjectDTO, @Req() req: IRequest, @Res() res: Response): Promise<Object> {
    projectDTO.userId = req.user.id;
    await this.projectsService.createProject(projectDTO);
    return res.status(HttpStatus.CREATED).json({ message: '프로젝트가 생성되었습니다.' });
  }

  @Get()
  async getAllProjects(@Res() res: Response): Promise<Object> {
    const projects = await this.projectsService.getAllProjects();
    return res.status(HttpStatus.OK).json({ projects });
  }

  @Get(':projectId')
  @UseGuards(accessAuthGuard)
  async getProject(@Param('projectId') projectId: number, @Req() req: IRequest, @Res() res: Response): Promise<Object> {
    const { id } = req.user;
    const project = await this.projectsService.getProject(projectId, id);
    return res.status(HttpStatus.OK).json({ project });
  }

  @Patch(':projectId')
  @UseGuards(accessAuthGuard)
  async updateProject(
    @Body('name') name: string,
    @Body('desc') desc: string,
    @Body('backgroundColor') backgroundColor: string,
    @Param('projectId') projectId: number,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<Object> {
    const { id } = req.user;
    if (!name && !desc && !backgroundColor) throw new HttpException('수정하려는 정보를 입력해 주세요.', HttpStatus.BAD_REQUEST);
    const projectDAO = { name, desc, background_color: backgroundColor };

    await this.projectsService.updateProject(projectId, id, projectDAO);
    return res.status(HttpStatus.OK).json({ message: '프로젝트 정보가 수정되었습니다.' });
  }

  @Delete(':projectId')
  @UseGuards(accessAuthGuard)
  async deleteProject(@Param('projectId') projectId: number, @Req() req: IRequest, @Res() res: Response): Promise<Object> {
    const { id } = req.user;

    await this.projectsService.deleteProject(projectId, id);
    return res.status(HttpStatus.OK).json({ message: '프로젝트가 삭제 되었습니다.' });
  }

  @Post(':projectId/invitation')
  @UseGuards(accessAuthGuard)
  async invitationProjectMember(
    @Body(ValidationPipe) emailDTO: EmailDTO,
    @Param('projectId') projectId: number,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<Object> {
    const { id, name } = req.user;
    const email = emailDTO.email;

    await this.projectsService.inviteProjectMember(projectId, id, email, name);
    return res.status(HttpStatus.OK).json({ message: '멤버를 초대했습니다.' });
  }

  @Post(':projectId/participation')
  async participateProjectMember(@Param('projectId') projectId: number, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { email } = req.query;
    await this.projectsService.participateProjectMember(projectId, email);

    return res.redirect('/');
    // return res.status(HttpStatus.OK).json({ message: '프로젝트에 정상적으로 참여했습니다.' });
  }
}
