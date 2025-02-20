import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'admin', description: 'Username of admin' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'New Admin Name', description: 'Full name of admin' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email of admin' })
  @IsEmail()
  email: string;
}
