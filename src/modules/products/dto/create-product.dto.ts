import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Mahsulot nomi', example: 'Datagaze Agent' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mahsulot haqida qisqacha ma\'lumot', example: 'Monitoring agent for servers', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Mahsulot versiyasi', example: '1.2.3' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ description: 'Mahsulotning asosiy fayli yo\'li', example: '/opt/datagaze/agent' })
  @IsString()
  @IsNotEmpty()
  path_to_main_file: string;

  @ApiProperty({ description: 'Mahsulotni ishga tushirish skripti', example: 'start.sh' })
  @IsString()
  @IsNotEmpty()
  run_script: string;

  @ApiProperty({ description: 'Mahsulotni o\'rnatish skripti', example: 'install.sh' })
  @IsString()
  @IsNotEmpty()
  install_script: string;
}
