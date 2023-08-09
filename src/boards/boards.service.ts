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

  // // 보드생성
  // async createBoard(body: CreateBoardDto, id: number, projectId: number): Promise<IResult> {
  //   const board = body;
  //   await this.boardRepository.create({ board, user: { id: id }, project: { id: projectId } });
  //   return { result: true };
  // }
}
