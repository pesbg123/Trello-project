import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(500)
  content: string;

  // @IsArray()
  collaborators: string[];

  @IsString()
  color: string;

  file: string;

  @IsNotEmpty({ message: '마감기한을 입력해주세요.' })
  deadlineAt: Date;
}
