import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/_common/entities/project.entity';
import { DataSource, Repository } from 'typeorm';
import { ProjectDTO } from './dto/project.dto';
import { ProjectMember } from 'src/_common/entities/projectMember.entity';
import { IResult } from 'src/_common/interfaces/result.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    private dataSource: DataSource,
  ) {}
  async createProject(projectDTO: ProjectDTO, userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const { id } = await queryRunner.manager.getRepository(Project).save({
        ...projectDTO,
        background_color: projectDTO.backgroundColor,
      });

      await queryRunner.manager.getRepository(ProjectMember).save({});
    } catch (err) {
      await queryRunner.rollbackTransaction();
    }
  }

  async checkCreator(userId: number): Promise<IResult> {
    const checkCreator = await this.projectRepository.findOne({ where: { id: userId } });

    if (!checkCreator) throw new HttpException('접근 권한이 없습니다.', HttpStatus.UNAUTHORIZED);

    return { result: true };
  }
}
