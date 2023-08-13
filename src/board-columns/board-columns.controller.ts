import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { CreateColumnDto, orderColumnDto, updateColumnDto } from 'src/_common/dtos/boardColumn.dto';
import { IResult } from 'src/_common/interfaces/result.interface';
import { AccessAuthGuard } from 'src/_common/middlewares/security/access.auth.guard';
import { CheckProjectCreatorInterceptor } from 'src/_common/interceptors/checkProjectCreatorInterceptor';

@Controller('projects/:projectId/columns')
@UseGuards(AccessAuthGuard)
export class BoardColumnsController {
  constructor(private readonly boardColumnService: BoardColumnsService) {}

  // 보드 컬럼 조회
  @Get()
  async getColumn(@Param('projectId') projectId: number) {
    return await this.boardColumnService.getColumn(projectId);
  }

  // 보드컬럼 생성
  @Post()
  @UseInterceptors(CheckProjectCreatorInterceptor)
  async createColumn(@Body() body: CreateColumnDto, @Param('projectId') projectId: number): Promise<IResult> {
    return await this.boardColumnService.createColumn(body, projectId);
  }

  // 보드컬럼 순서변경
  @Patch(':columnId/order')
  @UseInterceptors(CheckProjectCreatorInterceptor)
  async orderColumn(@Body() body: orderColumnDto, @Param('projectId') projectId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardColumnService.orderColumn(body, projectId, columnId);
  }

  // 보드컬럼명 수정
  @Patch(':columnId')
  @UseInterceptors(CheckProjectCreatorInterceptor)
  async updateColumn(@Body() body: updateColumnDto, @Param('projectId') projectId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardColumnService.updateColumn(body, projectId, columnId);
  }

  // 보드컬럼 삭제
  @Delete(':columnId')
  @UseInterceptors(CheckProjectCreatorInterceptor)
  async deleteColumn(@Param('projectId') projectId: number, @Param('columnId') columnId: number): Promise<IResult> {
    return await this.boardColumnService.deleteColumn(projectId, columnId);
  }
}
