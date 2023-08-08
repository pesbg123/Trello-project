import { Module } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { BoardColumnsController } from './board-columns.controller';
import { BoardColumn } from 'src/_common/entities/boardColumn.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn])],
  providers: [BoardColumnsService],
  controllers: [BoardColumnsController],
})
export class BoardColumnsModule {}
