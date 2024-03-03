import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'email@mail.com' })
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
