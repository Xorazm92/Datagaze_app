import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'superadmin', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'superadmin', description: 'Password' })
  @IsString()
  password: string;
}
