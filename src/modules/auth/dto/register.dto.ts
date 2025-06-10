import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  fullname: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Username for login',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Username can only contain letters, numbers, underscores and hyphens'
  })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, {
    message: 'Please provide a valid email address'
  })
  email: string;

  @ApiProperty({
    example: 'StrongP@ss123',
    description: 'Password for the account',
    minLength: 8,
    pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @ApiProperty({
    example: 'admin',
    description: 'Role of the user',
    enum: Role,
    default: Role.ADMIN
  })
  @IsOptional()
  @IsEnum(Role, {
    message: 'Role must be one of: ' + Object.values(Role).join(', ')
  })
  role?: Role = Role.ADMIN;
}
