import { Controller, Post, UseGuards, Get, Put, Delete, Param, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessAuthGuard } from 'src/_common/security/access.auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';

@Controller('/projects/:projectId/boards/:boardId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  //생성 로직 validation check
  // 1. 해당 프로젝트가 존재해야 하고 해당 프로젝트의 보드가 존재해야 댓글을 생성이 가능하다.
  // 2. 해당 프로젝트의 참여자일 경우에만 댓글 생성 권한이 주어진다.
  @Post()
  @UseGuards(AccessAuthGuard)
  async createComment(@Param('projectId') projectId: number, @Param('boardId') boardId: number, @Req() req: IRequest): Promise<any> {
    //이 req.user은 로그인된 헤더의 토큰을 verify했을 때 내부에 담겨있는 payload입니다.
    const { id } = req.user;
    await this.commentsService.createComment();
  }

  //조회 로직 validation check
  // 1. 해당 프로젝트와 보드가 존재해야만 댓글 조회가 가능하다.
  // 2. 해당 프로젝트의 참여자일 경우에만 댓글 조회 권한이 주어진다.
  @Get()
  @UseGuards(AccessAuthGuard)
  async getComments(@Param('projectId') projectId: number, @Param('boardId') boardId: number): Promise<any> {
    await this.commentsService.getComments();
  }

  //수정 로직 validation check
  // 1. 해당 프로젝트와 보드 그리고 댓글이 존재해야만 댓글 수정이 가능하다.
  // 2. 해당 프로젝트의 댓글 수정 권한이 있어야 수정이 가능하다.(댓글 수정 권한이 있다라는건 해당 프로젝트의 참여자 이므로 참여자 검증은 필요x)
  @Put(':commentId')
  @UseGuards(AccessAuthGuard)
  async updateComment(@Param('projectId') projectId: number, @Param('boardId') boardId: number): Promise<any> {
    await this.commentsService.updateComment();
  }

  //삭제 로직 validation check
  // 1. 해당 프로젝트와 보드 그리고 댓글이 존재해야만 댓글 삭제가 가능하다.
  // 2. 해당 프로젝트의 댓글 삭제 권한이 있어야 삭제가 가능하다.(댓글 삭제 권한이 있다라는건 해당 프로젝트의 참여자 이므로 참여자 검증은 필요x)
  @Delete(':commentId')
  @UseGuards(AccessAuthGuard)
  async deleteComment(@Param('projectId') projectId: number, @Param('boardId') boardId: number): Promise<any> {
    await this.commentsService.deleteComment();
  }
}
