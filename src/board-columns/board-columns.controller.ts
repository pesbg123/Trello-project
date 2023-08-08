import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { CreateColumnDto, moveColumnDto, updateColumnDto } from 'src/_common/dtos/boardColumn.dto';
import { IResult } from 'src/_common/interfaces/result.interface';

@Controller('projects/:projectId/columns')
export class BoardColumnsController {
  constructor(
    private readonly boardColumnService: BoardColumnsService, // private readonly projectService : ProjectsServie
  ) {}

  // 보드컬럼 생성
  @Post()
  async createColumn(@Body() body: CreateColumnDto, @Param('projectId') projectId: number): Promise<IResult> {
    return await this.boardColumnService.createColumn(body, projectId);
  }

  // 보드컬럼 순서변경
  @Patch(':columnId/move')
  async moveColumn(@Body() body: moveColumnDto, @Param('projectId') projectId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardColumnService.moveColumn(body, projectId, columnId);
  }

  // 보드컬럼명 수정
  @Patch(':columnId')
  async updateColumn(@Body() body: updateColumnDto, @Param('projectId') projectId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardColumnService.updateColumn(body, projectId, columnId);
  }

  // 보드컬럼 삭제
  @Delete(':columnId')
  async deleteColumn(@Param('projectId') projectId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardColumnService.deleteColumn(projectId, columnId);
  }
}
