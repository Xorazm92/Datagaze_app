import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstallApplicationDto {
  @ApiProperty()
  @IsString()
  app_name: string;

  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  installer_url?: string;
}

export class UpdateApplicationDto {
  @ApiProperty()
  @IsUUID()
  app_id: string;

  @ApiProperty()
  @IsString()
  new_version: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  update_url?: string;
}

export class RemoveApplicationDto {
  @ApiProperty()
  @IsUUID()
  app_id: string;
}
