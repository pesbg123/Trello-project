import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectsService } from '../projects/projects.service';

import { Comment } from '../_common/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    private projectsService: ProjectsService,
  ) {}
  // @InjectRepository(ProjectMember)
  // @InjectRepository(Project) // private projectRepository: Repository<Project>,
  // private projectMemberRepository: Repository<ProjectMember>,
  // @InjectRepository(Board)
  // private boardRepository: Repository<Board>,

  async createComment(content: string, id: number, projectId: number, boardId: number): Promise<void> {
    // 데이터 유효성 검증
    if (!content) {
      throw new BadRequestException('댓글을 입력해주세요.');
    }
    // 해당 프로젝트가 존재하고, 프로젝트 참여 인원인지 검증
    const existProject = await this.projectsService.getProject(projectId, id);
    if (!existProject) {
      return;
    }
    // 해당 프로젝트에 보드가 존재하는지 검증
    // const existBoard = await this.boardService.getBoard();

    return;
  }

  async getComments(): Promise<void> {}
  async updateComment(): Promise<void> {}
  async deleteComment(): Promise<void> {}
}
