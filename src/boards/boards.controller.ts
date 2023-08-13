import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { CreateBoardDto, orderBoardDto, UpdateBoardDto } from 'src/_common/dtos/board.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { Response } from 'express';
import { CheckMemberInterceptor } from 'src/_common/interceptors/checkMemberInterceptor';
import { CheckBoardCreatorInterceptor } from 'src/_common/interceptors/checkBoardCreatorInterceptor';

@Controller('projects/:projectId')
@UseInterceptors(CheckMemberInterceptor)
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  // 보드(카드) 전체조회
  @Get('boards')
  @UseGuards(AccessAuthGuard)
  async getBoards(@Param('projectId') projectId: number) {
    return await this.boardService.getBoards(projectId);
  }

  // 보드(카드) 디테일
  @Get('boards/:boardId')
  @UseGuards(AccessAuthGuard)
  async getBoardDetail(@Param('projectId') projectId: number, @Param('boardId') boardId: number) {
    return await this.boardService.getBoardDetail(projectId, boardId);
  }

  // 보드(카드) 생성
  @Post('boards')
  @UseGuards(AccessAuthGuard)
  @UsePipes(ValidationPipe)
  async createBoard(@Body() body: CreateBoardDto, @Req() req: IRequest, @Param('projectId') projectId: number): Promise<IResult> {
    const { id } = req.user;
    const boardImg = req.file ? req.file.location : null;
    return await this.boardService.createBoard(body, id, boardImg, projectId);
  }

  // 보드(카드) 수정
  @Patch('boards/:boardId')
  @UseGuards(AccessAuthGuard)
  @UseInterceptors(CheckBoardCreatorInterceptor)
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
  @UseInterceptors(CheckBoardCreatorInterceptor)
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
