import { Controller, Post, Body, Res, ValidationPipe, HttpStatus, Get, Param, UseGuards, Req, Patch, HttpException, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDTO } from '../_common/dtos/project.dto';
import { Response, Request } from 'express';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { EmailDTO } from 'src/_common/dtos/email.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AccessAuthGuard)
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
  @UseGuards(AccessAuthGuard)
  async getProject(@Param('projectId') projectId: number, @Req() req: IRequest, @Res() res: Response): Promise<Object> {
    const { id } = req.user;
    const { project, members } = await this.projectsService.getProject(projectId, id);
    return res.status(HttpStatus.OK).json({ project, members, name: req.user.name });
  }

  @Get('getProjects/myProject')
  @UseGuards(AccessAuthGuard)
  async getMyProject(@Req() req: IRequest, @Res() res: Response): Promise<Object> {
    const { id } = req.user;
    const myProject = await this.projectsService.getMyProject(id);
    return res.status(HttpStatus.OK).json({ myProject });
  }

  @Get('getProjects/joinProject')
  @UseGuards(AccessAuthGuard)
  async joinProject(@Req() req: IRequest, @Res() res: Response): Promise<Object> {
    const { id } = req.user;
    const joinProject = await this.projectsService.getJoinProject(id);
    return res.status(HttpStatus.OK).json({ joinProject, userName: req.user.name });
  }

  @Patch(':projectId')
  @UseGuards(AccessAuthGuard)
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
    if (name && (name.length < 2 || name.length > 20)) throw new HttpException('프로젝트명은 2~20자 사이 입니다. ', HttpStatus.BAD_REQUEST);
    if (desc && desc.length < 10) throw new HttpException('프로젝트 설명은 최소 10자 이상입니다. ', HttpStatus.BAD_REQUEST);
    const projectDAO = { name, desc, background_color: backgroundColor };

    await this.projectsService.updateProject(projectId, id, projectDAO);
    return res.status(HttpStatus.OK).json({ message: '프로젝트 정보가 수정되었습니다.' });
  }

  @Delete(':projectId')
  @UseGuards(AccessAuthGuard)
  async deleteProject(@Param('projectId') projectId: number, @Req() req: IRequest, @Res() res: Response): Promise<Object> {
    const { id } = req.user;

    await this.projectsService.deleteProject(projectId, id);
    return res.status(HttpStatus.OK).json({ message: '프로젝트가 삭제 되었습니다.' });
  }

  @Post(':projectId/invitation')
  @UseGuards(AccessAuthGuard)
  async invitationProjectMember(
    @Body(ValidationPipe) emailDTO: EmailDTO,
    @Param('projectId') projectId: number,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<Object> {
    const { id, name } = req.user;
    const email = emailDTO.email;

    const result = await this.projectsService.inviteProjectMember(projectId, id, email, name);
    return res.status(HttpStatus.OK).json({ message: '멤버를 초대했습니다.', userId: result.id, projectName: result.name, name });
  }

  @Post(':projectId/participation')
  async participateProjectMember(@Param('projectId') projectId: number, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { email } = req.query;
    await this.projectsService.participateProjectMember(projectId, email);

    return res.redirect('/');
  }
}
