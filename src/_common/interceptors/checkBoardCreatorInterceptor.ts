import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResult } from '../interfaces/result.interface';
import { BoardsService } from 'src/boards/boards.service';

@Injectable()
export class CheckBoardCreatorInterceptor implements NestInterceptor {
  constructor(private readonly boardService: BoardsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { id } = req.user;
    const { projectId, boardId } = req.params;

    const isCreator = await this.boardService.checkBoardCreator(projectId, boardId, id);

    return next.handle().pipe(map((data: IResult) => ({ ...data, isCreator })));
  }
}
