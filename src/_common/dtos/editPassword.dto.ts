import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../utils/match.decorator';

export class EditPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
  @Match('password', { message: '패스워드와 확인 패스워드가 일치하지 않습니다.' })
  confirmPassword: string;
}
