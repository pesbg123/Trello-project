import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/_common/entities/comment.entity';
import { ProjectsService } from '../projects/projects.service';
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private projectsService: ProjectsService,
    private boardsService: BoardsService,
  ) {}

  async createComment(content: string, id: number, projectId: number, boardId: number): Promise<string> {
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
    const existBoard = await this.boardsService.getBoard(boardId);
    if (!existBoard) {
      return;
    }
    // 댓글 생성
    const newComment = this.commentRepository.create({
      content,
      user: { id },
      board: { id: boardId },
    });
    // 댓글 저장
    await this.commentRepository.save(newComment);

    return '댓글 작성에 성공했습니다.';
  }

  async getComments(id: number, projectId: number, boardId: number): Promise<Comment[]> {
    // 해당 프로젝트에 보드가 존재하는지 검증
    const existBoard = await this.boardsService.getBoard(boardId);
    if (!existBoard) {
      return;
    }
    // 해당 프로젝트가 존재하고, 프로젝트 참여 인원인지 검증
    const existProject = await this.projectsService.getProject(projectId, id);
    if (!existProject) {
      return;
    }
    return await this.commentRepository.find({ where: { board: { id: boardId } } });
  }
  async updateComment(): Promise<void> {}
  async deleteComment(): Promise<void> {}
}
