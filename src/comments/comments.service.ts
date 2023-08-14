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

  // 댓글 생성
  async createComment(content: string, id: number, projectId: number, boardId: number, replyId: number): Promise<string> {
    console.log(content, id, typeof projectId, typeof boardId, typeof replyId);
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
    // 댓글 저장
    if (!replyId) {
      const newComment = this.commentRepository.create({
        content,
        user: { id },
        board: { id: boardId },
      });
      await this.commentRepository.save(newComment);
      return '댓글 작성에 성공했습니다.';
    } else if (replyId) {
      const newReply = this.commentRepository.create({
        replyId,
        content,
        user: { id },
        board: { id: boardId },
      });
      await this.commentRepository.save(newReply);
      return '대댓글 작성에 성공했습니다.';
    } else {
      throw new HttpException('댓글 생성에 실패하였습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 댓글 조회
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
    return await this.commentRepository.find({ where: { board: { id: boardId } }, relations: ['user'], order: { createdAt: 'DESC' } });
  }

  // 댓글 수정
  async updateComment(id: number, projectId: number, boardId: number, commentId: number, content: string): Promise<string> {
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
    // 해당 코멘트가 존재하는지 (본인이 작성한건지 검증)
    const existComment = await this.commentRepository.findOne({ where: { id: commentId, user: { id } } });
    console.log(existComment);
    if (!existComment) {
      throw new HttpException('본인이 작성한 댓글이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    // 코멘트 수정
    const result = await this.commentRepository.update({ id: commentId }, { content });
    if (!result.affected) {
      throw new HttpException('댓글 수정에 실패하였습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return '댓글 수정에 성공했습니다.';
  }

  // 댓글 삭제
  async deleteComment(id: number, projectId: number, boardId: number, commentId: number): Promise<string> {
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
    // 해당 코멘트가 존재하는지 (본인이 작성한건지 검증)
    const targetComment = await this.commentRepository.findOne({ where: { id: commentId, user: { id } } });
    if (!targetComment) {
      throw new HttpException('해당 댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    // 댓글 삭제
    const data = await this.commentRepository.remove(targetComment);
    if (data.id === undefined) {
      return '댓글을 성공적으로 삭제했습니다.';
    } else {
      throw new HttpException('댓글 삭제에 실패하였습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
