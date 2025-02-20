import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIP, IsOptional, IsEnum } from 'class-validator';

export enum ComputerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class ComputerDto {
  @ApiProperty({ example: 'PC-User1', description: 'Hostname of the computer' })
  @IsString()
  hostname: string;

  @ApiProperty({ example: '192.168.1.10', description: 'IP address' })
  @IsIP()
  ip_address: string;

  @ApiProperty({ example: 'Windows 10', description: 'Operating system name' })
  @IsString()
  @IsOptional()
  os_name?: string;

  @ApiProperty({ example: '21H2', description: 'Operating system version' })
  @IsString()
  @IsOptional()
  os_version?: string;

  @ApiProperty({
    enum: ComputerStatus,
    example: 'active',
    description: 'Computer status',
  })
  @IsEnum(ComputerStatus)
  @IsOptional()
  status?: ComputerStatus;
}

export class InstallApplicationDto {
  @ApiProperty({ example: 'Slack', description: 'Application name' })
  @IsString()
  app_name: string;

  @ApiProperty({ example: '5.0.3', description: 'Application version' })
  @IsString()
  version: string;

  @ApiProperty({
    example: 'https://example.com/slack_installer.exe',
    description: 'Installer URL',
  })
  @IsString()
  installer_url: string;
}

export class UpdateApplicationDto {
  @ApiProperty({ example: 'app-101', description: 'Application ID' })
  @IsString()
  app_id: string;

  @ApiProperty({ example: '122.0.2', description: 'New version' })
  @IsString()
  new_version: string;

  @ApiProperty({
    example: 'https://example.com/chrome_update.exe',
    description: 'Update URL',
  })
  @IsString()
  update_url: string;
}

export class RemoveApplicationDto {
  @ApiProperty({ example: 'app-102', description: 'Application ID' })
  @IsString()
  app_id: string;
}
