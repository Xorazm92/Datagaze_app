import { IsString, IsEnum, IsNumber } from 'class-validator';

export enum AlertType {
  LICENSE_EXCEED = 'license_exceed',
  LICENSE_DEADLINE = 'license_deadline',
  LICENSE_UPDATE = "LICENSE_UPDATE"
}

export class LicenseAlertDto {
  @IsString()
  productId: string;

  @IsEnum(AlertType)
  alertType: AlertType;

  @IsString()
  message: string;

  @IsNumber()
  daysRemaining?: number; // For deadline alerts
}
