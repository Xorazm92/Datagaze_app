import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class ConnectDto {
  @ApiProperty({ example: 'srv-1001', description: 'Server ID' })
  @IsUUID()
  server_id: string;

  @ApiProperty({ example: '192.168.1.100', description: 'Server IP address' })
  @IsString()
  ip: string;

  @ApiProperty({ example: 22, description: 'SSH port' })
  @IsNumber()
  @IsOptional()
  port?: number;

  @ApiProperty({ example: 'admin', description: 'SSH username' })
  @IsString()
  username: string;

  @ApiProperty({ enum: ['password', 'key'], description: 'Authentication type' })
  @IsEnum(['password', 'key'])
  auth_type: 'password' | 'key';

  @ApiProperty({ example: 'securepass123', description: 'SSH password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'SSH private key' })
  @IsString()
  @IsOptional()
  private_key?: string;

  @ApiProperty({ description: 'Private key passphrase' })
  @IsString()
  @IsOptional()
  passphrase?: string;
}

export class StoreCredentialsDto extends ConnectDto {
  @ApiProperty({ example: 'Production Server', description: 'Server name' })
  @IsString()
  name: string;
}
