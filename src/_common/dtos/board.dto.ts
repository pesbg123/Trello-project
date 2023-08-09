import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  content: string;

  @IsNotEmpty({ message: '담당자를 입력해주세요' })
  collaborators: string[];

  @IsString()
  @IsNotEmpty({ message: '색상을 입력해주세요' })
  color: string;

  @IsNotEmpty({ message: '마감기한을 입력해주세요.' })
  deadlineAt: Date;
}

export class UpdateBoardDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  content: string;

  @IsNotEmpty({ message: '담당자를 입력해주세요' })
  collaborators: string[];

  @IsString()
  @IsNotEmpty({ message: '색상을 입력해주세요' })
  color: string;

  @IsNotEmpty({ message: '마감기한을 입력해주세요.' })
  deadlineAt: Date;
}

export class orderBoardDto {
  @IsInt()
  @IsNotEmpty({ message: '컬럼의 위치를 선택해주세요' })
  newBoardSequence: number;
}
