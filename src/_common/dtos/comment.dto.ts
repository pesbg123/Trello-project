import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: '댓글을 입력해주세요.' })
  readonly content: string;
}
