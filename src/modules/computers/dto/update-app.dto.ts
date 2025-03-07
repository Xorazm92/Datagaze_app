import { IsString, IsUrl } from 'class-validator';

export class UpdateAppDto {
  @IsString()
  computerId: string;

  @IsString()
  appId: string;

  @IsString()
  newVersion: string;

  @IsUrl()
  updateUrl: string;
}
