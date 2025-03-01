import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateSoftwareDto {
  @ApiProperty({ example: 'DLP', description: 'Name of the application' })
  @IsString()
  application_name: string;

  @ApiProperty({ example: '4.7.2', description: 'Version of the application' })
  @IsString()
  version: string;

  @ApiProperty({ example: false, description: 'Installation status' })
  @IsBoolean()
  @IsOptional()
  is_installed?: boolean;

  @ApiProperty({ example: '/files/web_applications/dlp/dlp-4.7.2.exe', description: 'Path to application file' })
  @IsString()
  @IsOptional()
  path_to_file?: string;

  @ApiProperty({ example: '/assets/logo/dlp.png', description: 'Path to application icon' })
  @IsString()
  @IsOptional()
  path_to_icon?: string;
}

export class UpdateSoftwareDto extends CreateSoftwareDto {}
