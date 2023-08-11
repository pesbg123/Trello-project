import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto, orderBoardDto, UpdateBoardDto } from 'src/_common/dtos/board.dto';
import { Board } from 'src/_common/entities/board.entity';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';
import { IResult } from 'src/_common/interfaces/result.interface';
import { EntityManager, Repository } from 'typeorm';
import * as AWS from 'aws-sdk';

@Injectable()
export class BoardsService {
  private s3: AWS.S3;
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardColumn)
    private readonly boardColumnRepository: Repository<BoardColumn>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
      region: process.env.AWS_REGION,
    });
  }

  async getBoard(boardId: number): Promise<Board> {
    const existBoard = await this.boardRepository.findOne({ where: { id: boardId } });
    if (!existBoard) throw new HttpException('해당 보드를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    return existBoard;
  }

  // 보드(카드) 전체조회
  async getBoards(projectId: number): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      where: { project: { id: projectId } },
      relations: ['boardColumn'],
      order: { boardSequence: 'ASC' },
    });

    return boards;
  }

  // 보드(카드) 디테일
  async getBoardDetail(projectId: number, boardId: number): Promise<Board> {
    const boardDetail = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } }, relations: ['user', 'comments'] });

    if (!boardDetail) throw new HttpException('해당 보드를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    console.log(boardDetail);
    return boardDetail;
  }

  // 보드(카드) 생성
  async createBoard(body: CreateBoardDto, userId: number, boardImg: string, projectId: number): Promise<IResult> {
    const targetColumn = await this.boardColumnRepository.findOne({
      where: { id: body.columnId, project: { id: projectId } },
      relations: ['boards'],
    });

    const collaborators = String(body.collaborators)
      .split(',')
      .map((x) => Number(x));

    const entityManager = this.boardRepository.manager;
    if (!targetColumn) throw new HttpException('해당 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const maxSequence = targetColumn.boards.reduce((max, b) => Math.max(max, b.boardSequence), 0);

      const newBoard = this.boardRepository.create({
        ...body,
        file: boardImg,
        collaborators: collaborators,
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
    const targetBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });

    if (!targetBoard) throw new HttpException('해당 보드를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await this.boardRepository.remove(targetBoard);

    return { result: true };
  }

  // 보드 생성자 확인
  async checkBoardCreator(projectId: number, boardId: number, userId: number): Promise<IResult> {
    const boardCreator = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId }, user: { id: userId } } });

    if (!boardCreator) throw new HttpException('접근 권한이 없습니다', HttpStatus.UNAUTHORIZED);

    return { result: true };
  }

  // 프론트 구현 후 테스트필요
  async downloadFile(projectId: number, boardId: number, filename: string): Promise<Buffer> {
    const key = `${projectId}/${boardId}/${filename}`;

    try {
      const data = await this.s3.getObject({ Bucket: process.env.BUCKET_NAME, Key: key }).promise();

      return data.Body as Buffer;
    } catch (error) {
      throw new HttpException('파일을 다운로드할 수 없습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
