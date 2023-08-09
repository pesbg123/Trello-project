import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AccessAuthGuard } from 'src/_common/security/access.auth.guard';
import { CreateBoardDto } from 'src/_common/dtos/createBoard.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { IRequest } from 'src/_common/interfaces/request.interface';

@Controller('')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  // 보드생성
  @Post('projects/:projectId/:columnId/boards')
  @UseGuards(AccessAuthGuard)
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
}
