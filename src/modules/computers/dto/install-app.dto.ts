import { IsString, IsUrl, IsOptional } from 'class-validator';

export class InstallAppDto {
  @IsString()
  computerId: string;

  @IsString()
  appName: string;

  @IsString()
  version: string;

  @IsUrl()
  installerUrl: string;

  @IsOptional()
  @IsString()
  installationArgs?: string;
}
