import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from 'src/_common/entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadMiddleware } from 'src/_common/middlewares/upload-middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({ path: '/projects/:projectId/columns', method: RequestMethod.POST });
  }
}
