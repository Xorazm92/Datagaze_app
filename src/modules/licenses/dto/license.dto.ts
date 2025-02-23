import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class GetProductsDto {
  @ApiProperty({ example: '12345', description: 'Server ID' })
  @IsString()
  server_id: string;
}

export class UploadLicenseDto {
  @ApiProperty({ example: '12345', description: 'Server ID' })
  @IsString()
  server_id: string;

  @ApiProperty({ example: 'Antivirus X', description: 'Product name' })
  @IsString()
  product_name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'License file (.lic)',
  })
  license_file: any;
}

export class LicenseExceedDto {
  @ApiProperty({ example: '12345', description: 'Server ID' })
  @IsString()
  server_id: string;

  @ApiProperty({ example: 'Database Pro', description: 'Product name' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: 10, description: 'Allowed instances' })
  @IsNumber()
  allowed_instances: number;

  @ApiProperty({ example: 12, description: 'Current instances' })
  @IsNumber()
  current_instances: number;
}

export class LicenseDeadlineDto {
  @ApiProperty({ example: '12345', description: 'Server ID' })
  @IsString()
  server_id: string;

  @ApiProperty({ example: 'Antivirus X', description: 'Product name' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: '2025-02-18', description: 'Expiration date' })
  @IsDateString()
  expiration_date: string;

  @ApiProperty({ example: 7, description: 'Days remaining' })
  @IsNumber()
  days_remaining: number;
}
