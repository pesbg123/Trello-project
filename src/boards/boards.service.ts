import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto, orderBoardDto, UpdateBoardDto } from 'src/_common/dtos/board.dto';
import { Board } from 'src/_common/entities/board.entity';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';
import { IResult } from 'src/_common/interfaces/result.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardColumn)
    private readonly boardColumnRepository: Repository<BoardColumn>,
  ) {}

  // 보드(카드) 생성
  async createBoard(body: CreateBoardDto, userId: number, projectId: number, columnId: number, boardImg: string): Promise<IResult> {
    const targetColumn = await this.boardColumnRepository.findOne({ where: { id: columnId, project: { id: projectId } }, relations: ['boards'] });
    console.log(targetColumn);

    const entityManager = this.boardRepository.manager;
    if (!targetColumn) throw new HttpException('해당 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const maxSequence = targetColumn.boards.reduce((max, b) => Math.max(max, b.boardSequence), 0);

      const newBoard = this.boardRepository.create({
        ...body,
        file: boardImg,
        boardSequence: maxSequence + 1,
        user: { id: userId },
        project: { id: projectId },
        boardColumn: targetColumn,
      });

      await transactionEntityManager.save(Board, newBoard);
    });

    return { result: true };
  }

  // 보드(카드) 수정
  async updateBoard(projectId: number, boardId: number, body: UpdateBoardDto, boardImg: string): Promise<IResult> {
    const existBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });
    const newBoardImg = boardImg ? boardImg : existBoard.file;

    if (!existBoard) throw new HttpException('해당 보드를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await this.boardRepository.update({ id: boardId, project: { id: projectId } }, { ...body, file: newBoardImg });

    return { result: true };
  }

  // 보드(카드) 동일 컬럼 내 이동
  async orderBoard(body: orderBoardDto, projectId: number, boardId: number): Promise<IResult> {
    const { newBoardSequence } = body;
    const entityManager = this.boardRepository.manager;

    const findBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });

    if (!findBoard) throw new HttpException('해당 보드를 찾을 수 없습니다', HttpStatus.NOT_FOUND);

    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const targetBoard = await this.boardRepository.findOne({ where: { boardSequence: newBoardSequence } });

      if (targetBoard) {
        const changeSequence = findBoard.boardSequence;
        findBoard.boardSequence = targetBoard.boardSequence;
        targetBoard.boardSequence = changeSequence;
        await transactionEntityManager.save(Board, [findBoard, targetBoard]);
      }

      findBoard.boardSequence = newBoardSequence;
      await transactionEntityManager.save(Board, findBoard);
    });

    return { result: true };
  }

  // 보드(카드) 다른 컬럼으로 이동
  async moveBoard(projectId: number, boardId: number, columnId: number): Promise<IResult> {
    const targetBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });
    const targetColumn = await this.boardColumnRepository.findOne({ where: { id: columnId }, relations: ['boards'] });
    const entityManager = this.boardRepository.manager;

    if (!targetBoard || !targetColumn) throw new HttpException('해당 보드 또는 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const maxSequence = targetColumn.boards.reduce((max, b) => Math.max(max, b.boardSequence), 0);

      targetBoard.boardColumn = targetColumn;
      targetBoard.boardSequence = maxSequence + 1;
      await transactionEntityManager.save(Board, targetBoard);
    });

    return { result: true };
  }

  // 보드(카드) 삭제
  async deleteBoard(projectId: number, boardId: number): Promise<IResult> {
    console.error();
    const targetBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });

    if (!targetBoard) throw new HttpException('해당 보드를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await this.boardRepository.remove(targetBoard);

    return { result: true };
  }
}
