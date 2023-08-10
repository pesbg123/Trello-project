import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { CreateBoardDto, orderBoardDto, UpdateBoardDto } from 'src/_common/dtos/board.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { CheckCreatorInterceptor } from 'src/_common/utils/checkCreatorInterceptor';
import { Response } from 'express';

@Controller('projects/:projectId')
@UseInterceptors(CheckCreatorInterceptor)
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  // 보드(카드) 생성
  @Post(':columnId/boards')
  @UseGuards(AccessAuthGuard)
  @UsePipes(ValidationPipe)
  async createBoard(
    @Body() body: CreateBoardDto,
    @Param('projectId') projectId: number,
    @Param('columnId') columnId: number,
    @Req() req: IRequest,
  ): Promise<IResult> {
    const { id } = req.user;
    const boardImg = req.file ? req.file.location : null;
    return await this.boardService.createBoard(body, id, projectId, columnId, boardImg);
  }

  // 보드(카드) 수정
  @Patch('boards/:boardId')
  @UseGuards(AccessAuthGuard)
  async updateBoard(
    @Body() body: UpdateBoardDto,
    @Param('projectId') projectId: number,
    @Param('boardId') boardId: number,
    @Req() req: IRequest,
  ): Promise<IResult> {
    const boardImg = req.file ? req.file.location : null;

    return await this.boardService.updateBoard(projectId, boardId, body, boardImg);
  }

  // 보드(카드) 동일 컬럼 내 순서변경
  @Patch('boards/:boardId/order')
  @UseGuards(AccessAuthGuard)
  async orderBoard(@Body() body: orderBoardDto, @Param('projectId') projectId: number, @Param('boardId') boardId: number): Promise<IResult> {
    return await this.boardService.orderBoard(body, projectId, boardId);
  }

  // 보드(카드) 다른 컬럼으로 이동
  @Patch('boards/:boardId/:columnId/move')
  @UseGuards(AccessAuthGuard)
  async moveBoard(@Param('projectId') projectId: number, @Param('boardId') boardId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardService.moveBoard(projectId, boardId, columnId);
  }
  // 보드(카드) 삭제
  @Delete('boards/:boardId')
  @UseGuards(AccessAuthGuard)
  async deleteBoard(@Param('projectId') projectId: number, @Param('boardId') boardId: number): Promise<IResult> {
    return await this.boardService.deleteBoard(projectId, boardId);
  }

  // 프론트구현 후 테스트필요
  @Get('boards/:boardId/download/:filename')
  @UseGuards(AccessAuthGuard)
  async downloadFile(
    @Param('projectId') projectId: number,
    @Param('boardId') boardId: number,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const file = await this.boardService.downloadFile(projectId, boardId, filename);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    res.send(file);
  }
}
