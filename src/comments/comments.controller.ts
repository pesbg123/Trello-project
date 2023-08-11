import { Controller, Post, UseGuards, Get, Put, Delete, Param, Req, Res, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessAuthGuard } from 'src/_common/security/access.auth.guard';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { Response } from 'express';

@Controller('/projects/:projectId/boards/:boardId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  //생성 로직
  @Post()
  @UseGuards(AccessAuthGuard)
  async createComment(
    @Param('projectId') projectId: number,
    @Param('boardId') boardId: number,
    @Body('content') content: string,
    @Body('replyId') replyId: string,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<void> {
    //이 req.user은 로그인된 헤더의 토큰을 verify했을 때 내부에 담겨있는 payload입니다.
    const { id } = req.user;

    const message: string = await this.commentsService.createComment(content, id, projectId, boardId, replyId);
    // 댓글 생성에 성공하면 200 OK
    res.status(200).json({ message });
  }

  //조회 로직
  @Get()
  @UseGuards(AccessAuthGuard)
  async getComments(
    @Param('projectId') projectId: number,
    @Param('boardId') boardId: number,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<void> {
    const { id } = req.user;

    const data: object = await this.commentsService.getComments(id, projectId, boardId);
    res.status(200).json(data);
  }

  //수정 로직 validation check
  @Put(':commentId')
  @UseGuards(AccessAuthGuard)
  async updateComment(
    @Param('projectId') projectId: number,
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
    @Body('content') content: string,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<void> {
    const { id } = req.user;

    const message: string = await this.commentsService.updateComment(id, projectId, boardId, commentId, content);
    // 댓글 생성에 성공하면 200 OK
    res.status(200).json({ message });
  }

  //삭제 로직
  @Delete(':commentId')
  @UseGuards(AccessAuthGuard)
  async deleteComment(
    @Param('projectId') projectId: number,
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
    @Req() req: IRequest,
    @Res() res: Response,
  ): Promise<void> {
    const { id } = req.user;

    const message: string = await this.commentsService.deleteComment(id, projectId, boardId, commentId);
    res.status(200).send({ message });
  }
}
