import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/_common/entities/project.entity';
import { DataSource, Repository } from 'typeorm';
import { ProjectDTO } from '../_common/dtos/project.dto';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    private dataSource: DataSource,
    private userService: UsersService,
    private mailService: MailService,
  ) {}
  async createProject(projectDTO: ProjectDTO): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const { id } = await queryRunner.manager.getRepository(Project).save({
        ...projectDTO,
        background_color: projectDTO.backgroundColor,
        user: { id: projectDTO.userId },
      });

      await queryRunner.manager.getRepository(ProjectMember).save({
        user: { id: projectDTO.userId },
        participation: true,
        project: { id },
      });
      await queryRunner.commitTransaction();
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  async getAllProjects(): Promise<Object> {
    const projects = await this.projectRepository.find();
    return projects;
  }

  async getProject(projectId: number, userId: number): Promise<Object> {
    const existProject = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!existProject) throw new HttpException('해당 프로젝트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    const existAuthorization = await this.projectMemberRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId }, participation: true },
    });
    if (!existAuthorization) throw new HttpException('해당 프로젝트의 조회 권한이 없습니다.', HttpStatus.UNAUTHORIZED);

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    return project;
  }

  async updateProject(projectId: number, userId: number, projectDAO: any): Promise<void> {
    const existProject = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!existProject) throw new HttpException('해당 프로젝트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    const existAuthorization = await this.projectRepository.findOne({ where: { id: projectId, user: { id: userId } } });
    if (!existAuthorization) throw new HttpException('해당 프로젝트의 수정 권한이 없습니다.', HttpStatus.UNAUTHORIZED);

    await this.projectRepository.update(
      { id: projectId },
      { name: projectDAO.name, desc: projectDAO.desc, background_color: projectDAO.background_color },
    );
  }

  async deleteProject(projectId: number, userId: number): Promise<void> {
    const existProject = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!existProject) throw new HttpException('해당 프로젝트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    const existAuthorization = await this.projectRepository.findOne({ where: { id: projectId, user: { id: userId } } });
    if (!existAuthorization) throw new HttpException('해당 프로젝트의 삭제 권한이 없습니다.', HttpStatus.UNAUTHORIZED);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      await queryRunner.manager.getRepository(ProjectMember).delete({ project: { id: projectId } });
      await queryRunner.manager.getRepository(Project).delete({ id: projectId });

      await queryRunner.commitTransaction();
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  async inviteProjectMember(projectId: number, userId: number, email: string, name: string): Promise<void> {
    const existProject = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!existProject) throw new HttpException('해당 프로젝트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    console.log(existProject.name);
    const existAuthorization = await this.projectRepository.findOne({ where: { id: projectId, user: { id: userId } } });
    if (!existAuthorization) throw new HttpException('해당 프로젝트의 멤버 초대 권한이 없습니다.', HttpStatus.UNAUTHORIZED);

    const id = await this.userService.findUser(email);
    if (!id) throw new HttpException('존재하지 않는 유저입니다.', HttpStatus.NOT_FOUND);

    const existMember = await this.projectMemberRepository.findOne({ where: { user: { id }, project: { id: projectId } } });
    if (existMember) throw new HttpException('이미 초대된 유저입니다. ', HttpStatus.BAD_REQUEST);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      await queryRunner.manager.getRepository(ProjectMember).save({ project: { id: projectId }, user: { id } });
      await this.mailService.inviteProjectMail(email, name, existProject.name, projectId);
      await queryRunner.commitTransaction();
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  async participateProjectMember(projectId: number, email: any): Promise<void> {
    const id = await this.userService.findUser(email);
    await this.projectMemberRepository.update({ project: { id: projectId }, user: { id } }, { participation: true });
  }
}
