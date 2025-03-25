
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'superadmin',
    description: 'Username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'superadmin',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
