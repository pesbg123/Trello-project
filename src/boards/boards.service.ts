import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from 'src/_common/dtos/createBoard.dto';
import { Board } from 'src/_common/entities/board.entity';
import { IResult } from 'src/_common/interfaces/result.interface';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  // 보드생성
  async createBoard(body: CreateBoardDto, userId: number, projectId: number, columnId: number, boardImg: string): Promise<IResult> {
    const newBoard = this.boardRepository.create({
      ...body,
      file: boardImg,
      user: { id: userId },
      project: { id: projectId },
      boardColumn: { id: columnId },
    });
    await this.boardRepository.save(newBoard);

    return { result: true };
  }
}
