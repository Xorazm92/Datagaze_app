import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSshDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'A user-friendly name for the server', example: 'My Web Server' })
  name: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: 'product_id', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  product_id?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'IP address of the server',
    example: '170.64.141.16',
  })
  ip: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Port for SSH connection', example: 22 })
  port: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Username for SSH login', example: 'ubuntu' })
  username: string;

  @IsNotEmpty()
  @IsEnum(['password', 'private_key'])
  @ApiProperty({ description: 'Authentication type', example: 'password', enum: ['password', 'private_key'] })
  auth_type: 'password' | 'private_key';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Password for authentication', example: 'yourSecretPassword123', required: false })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Private key for authentication', example: '-----BEGIN RSA PRIVATE KEY-----...', required: false })
  private_key?: string;
}

