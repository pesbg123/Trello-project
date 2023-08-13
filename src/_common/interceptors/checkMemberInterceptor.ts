import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectsService } from 'src/projects/projects.service';
import { IResult } from '../interfaces/result.interface';

@Injectable()
export class CheckMemberInterceptor implements NestInterceptor {
  constructor(private readonly projectService: ProjectsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { id } = req.user;
    const { projectId } = req.params;

    await this.projectService.checkMember(projectId, id);

    return next.handle().pipe(
      tap((data: IResult) => {
        return data;
      }),
    );
  }
}
