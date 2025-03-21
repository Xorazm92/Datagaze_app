import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIP,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

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
  @ApiProperty({
    example: 'Slack',
    description: 'Name of the application to install',
  })
  @IsString()
  @IsNotEmpty()
  app_name: string;

  @ApiProperty({
    example: '4.29.149',
    description: 'Version of the application to install',
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    example:
      'https://downloads.slack.com/desktop/slack-desktop-4.29.149-amd64.deb',
    description: 'URL to download the installer',
  })
  @IsUrl()
  @IsNotEmpty()
  installer_url: string;
}

export class UpdateApplicationDto {
  @ApiProperty({
    example: '6c8f35c8-f578-40a2-9723-6fcec8765a7e',
    description: 'ID of the application to update',
  })
  @IsString()
  @IsNotEmpty()
  app_id: string;

  @ApiProperty({
    example: '4.30.0',
    description: 'New version to update to',
  })
  @IsString()
  @IsNotEmpty()
  new_version: string;

  @ApiProperty({
    example:
      'https://downloads.slack.com/desktop/slack-desktop-4.30.0-amd64.deb',
    description: 'URL to download the update',
  })
  @IsUrl()
  @IsNotEmpty()
  update_url: string;
}

export class RemoveApplicationDto {
  @ApiProperty({
    example: '6c8f35c8-f578-40a2-9723-6fcec8765a7e',
    description: 'ID of the application to remove',
  })
  @IsString()
  @IsNotEmpty()
  app_id: string;
}
