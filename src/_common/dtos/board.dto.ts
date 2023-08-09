import { IsArray, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(500)
  content: string;

  @IsNotEmpty({ message: '담당자를 결정해주세요' })
  collaborators: string[];

  @IsString()
  color: string;

  @IsNotEmpty({ message: '마감기한을 입력해주세요.' })
  deadlineAt: Date;

  @IsInt()
  @IsNotEmpty({ message: '컬럼의 위치를 선택해주세요' })
  boardSequence: number;
}

export class orderBoardDto {
  @IsInt()
  @IsNotEmpty({ message: '컬럼의 위치를 선택해주세요' })
  newBoardSequence: number;
}
