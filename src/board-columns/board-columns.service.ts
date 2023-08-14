import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateColumnDto, orderColumnDto, updateColumnDto } from 'src/_common/dtos/boardColumn.dto';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';
import { IResult } from 'src/_common/interfaces/result.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BoardColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private boardColumnRepository: Repository<BoardColumn>,
  ) {}

  // 보드컬럼 조회
  async getColumn(projectId: number): Promise<BoardColumn[]> {
    const columns = await this.boardColumnRepository.find({ where: { project: { id: projectId } }, order: { sequence: 'ASC' } });

    return columns;
  }

  // 보드컬럼 생성
  async createColumn(body: CreateColumnDto, projectId: number): Promise<IResult> {
    const { columnName } = body;

    const existColumn = await this.boardColumnRepository.findOne({ where: { project: { id: projectId }, name: columnName } });

    if (existColumn) throw new HttpException('이미 존재하는 컬럼입니다.', HttpStatus.CONFLICT);

    // 프로젝트에 해당하는 컬럼 전체 조회
    const columns = await this.boardColumnRepository.find({
      where: { project: { id: projectId } },
      order: { sequence: 'DESC' },
    });

    const maxSequence = columns.length > 0 ? columns[0].sequence : 0;
    const newSequence = maxSequence + 1;

    const newColumn = this.boardColumnRepository.create({ ...body, sequence: newSequence, name: columnName, project: { id: projectId } });
    await this.boardColumnRepository.save(newColumn);

    return { result: true };
  }

  // 보드컬럼 순서수정
  async orderColumn(body: orderColumnDto, projectId: number, columnId: number): Promise<IResult> {
    const { newSequence } = body;
    const entityManager = this.boardColumnRepository.manager;
    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const findColumn = await this.boardColumnRepository.findOne({ where: { id: columnId, project: { id: projectId } } });

      if (!findColumn) throw new HttpException('해당 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

      const targetColumn = await this.boardColumnRepository.findOne({ where: { sequence: newSequence } });

      /* 시퀀스번호가 일치하는 컬럼이 있다면 번호를 교체해줌,
     번호를 일괄수정하려 했으나 컬럼개수가 많아진다면 일일이 DB를 업데이트 해줘야하므로
     비효율적이라고 판단 */

      if (targetColumn) {
        const changeSequence = findColumn.sequence;
        findColumn.sequence = targetColumn.sequence;
        targetColumn.sequence = changeSequence;
        await transactionEntityManager.save(BoardColumn, [findColumn, targetColumn]);
      }

      // 없다면 중복되는 시퀀스번호가 없으므로 저장
      findColumn.sequence = newSequence;
      await transactionEntityManager.save(BoardColumn, findColumn);
    });

    return { result: true };
  }

  // 보드컬럼명 수정
  async updateColumn(body: updateColumnDto, projectId: number, columnId: number): Promise<IResult> {
    const { columnName } = body;
    const findColumn = await this.boardColumnRepository.findOne({ where: { id: columnId, project: { id: projectId } } });

    if (!findColumn) throw new HttpException('해당 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    findColumn.name = columnName;
    await this.boardColumnRepository.save(findColumn);

    return { result: true };
  }

  // 보드컬럼 삭제
  async deleteColumn(projectId: number, columnId: number): Promise<IResult> {
    const findColumn = await this.boardColumnRepository.findOne({ where: { id: columnId, project: { id: projectId } } });

    if (!findColumn) throw new HttpException('해당 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await this.boardColumnRepository.remove(findColumn);

    return { result: true };
  }
}
