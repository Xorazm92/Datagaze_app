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
    example: 'Talantbek',
    description: 'Username for registration',
  })

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  fullname: string;

  @ApiProperty({
    example: 'sabrqil',
    description: 'Username for registration',
  })


  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'sabr@gmail.com',
    description: 'Email address of the user',
  })

  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Parol@123',
    description: 'Password for registration',
  })

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
