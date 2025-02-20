import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username of admin' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'SecurePass123', description: 'Password of admin' })
  @IsString()
  @MinLength(6)
  password: string;
}
