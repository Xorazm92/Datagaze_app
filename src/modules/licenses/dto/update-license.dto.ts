import { IsString, IsOptional } from 'class-validator';

export class UpdateLicenseDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  licenseFile?: string; // Base64 encoded .lic file
}
