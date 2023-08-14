import { IsString, Length, MinLength } from 'class-validator';

export class ProjectDTO {
  @IsString({ message: '프로젝트명을 입력해 주세요.' })
  @Length(2, 20, { message: '프로젝트명은 2~20자 사이 입니다. ' })
  name: string;

  @IsString({ message: '프로젝트에 대한 설명을 입력해 주세요' })
  @MinLength(10, { message: '프로젝트 설명은 최소 10자 이상입니다. ' })
  desc: string;

  @IsString({ message: '프로젝트 배경 색상을 입력해 주세요.' })
  backgroundColor: string;

  userId: number;
}
