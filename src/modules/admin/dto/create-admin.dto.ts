import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export class CreateAdminDto {
  @ApiProperty({ example: 'admin', description: 'Username of admin' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email of admin' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of admin' })
  @IsString()
  @MinLength(6)
  password: string;

  // @ApiProperty({
  //   example: AdminRole.ADMIN,
  //   description: 'Role of admin',
  //   enum: AdminRole,
  //   default: AdminRole.ADMIN,
  // })
  // @IsEnum(AdminRole)
  // role: AdminRole;
}
