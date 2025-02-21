import { IsEmail, IsString, MinLength, IsEnum, Matches } from 'class-validator';
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
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }
  )
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
