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
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

  // @ApiProperty({
  //   example: 'admin',
  //   description: 'Role of the user (default is user)',
  // })
  // @IsOptional()
  // @IsEnum(Role, { message: 'Role must be one of superadmin, admin, or user' })
  // role?: Role = Role.ADMIN; // Default role is 'user'
  // fullname: any;
// }
