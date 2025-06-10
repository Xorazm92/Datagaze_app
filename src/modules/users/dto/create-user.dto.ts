// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'testuser', description: 'Username' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'testuser', description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin', description: 'User role', required: false, enum: ['admin', 'user'] })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  role?: string;
}
