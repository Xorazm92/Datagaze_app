import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'TemporaryPass$987',
    description: 'Current password',
    minLength: 8,
    maxLength: 100
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  old_password: string;

  @ApiProperty({
    example: 'NewTemporaryPass987!',
    description: 'New password',
    minLength: 8,
    maxLength: 100
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  )
  new_password: string;
}

export class SuperAdminUpdatePasswordDto {
  @ApiProperty({
    example: 2,
    description: 'User ID to update password for',
    type: Number
  })
  @Type(() => Number)
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'TemporaryPass$987',
    description: 'New password for the user',
    minLength: 8,
    maxLength: 100
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  )
  new_password: string;
}
