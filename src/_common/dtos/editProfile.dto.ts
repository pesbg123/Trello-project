import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class EditProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;
}
