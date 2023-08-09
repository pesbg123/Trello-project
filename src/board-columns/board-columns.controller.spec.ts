import { Test, TestingModule } from '@nestjs/testing';
import { BoardColumnsController } from './board-columns.controller';

describe('BoardColumnsController', () => {
  let controller: BoardColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardColumnsController],
    }).compile();

    controller = module.get<BoardColumnsController>(BoardColumnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
