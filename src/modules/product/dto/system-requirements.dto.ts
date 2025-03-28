
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SystemRequirementsDto {
  @ApiProperty()
  @IsNumber()
  minRam: number;

  @ApiProperty()
  @IsNumber()
  minStorage: number;

  @ApiProperty()
  @IsString()
  osVersion: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalRequirements?: string;
}
