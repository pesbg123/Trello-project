import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty({ message: '컬럼의 이름을 입력해주세요.' })
  columnName: string;

  // @IsInt()
  // @IsNotEmpty({ message: '컬럼의 위치를 선택해주세요' })
  // sequence: number;
}

export class orderColumnDto {
  @IsInt()
  @IsNotEmpty({ message: '컬럼의 위치를 선택해주세요' })
  newSequence: number;
}

export class updateColumnDto {
  @IsString()
  @IsNotEmpty({ message: '수정할 컬럼명을 입력해주세요' })
  columnName: string;
}
