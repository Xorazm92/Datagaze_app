import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'admin',
    description: 'Username of admin',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Username can only contain letters, numbers, underscores and hyphens'
  })
  username: string;

  @ApiProperty({
    example: 'New Admin Name',
    description: 'Full name of admin',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Name can only contain letters and spaces'
  })
  name: string;

  @ApiProperty({
    example: 'newemail@example.com',
    description: 'Email of admin',
    maxLength: 100
  })
  @IsEmail()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Please enter a valid email address'
  })
  email: string;
}
