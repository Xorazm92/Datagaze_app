import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ description: 'Mahsulotning noyob identifikatori', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ description: 'Mahsulot nomi', example: 'Datagaze Agent' })
  name: string;

  @ApiProperty({ description: 'Mahsulot haqida qisqacha ma\'lumot', example: 'Monitoring agent for servers' })
  description: string;

  @ApiProperty({ description: 'Mahsulot versiyasi', example: '1.2.3' })
  version: string;

  @ApiProperty({ description: 'Mahsulotning asosiy fayli yo\'li', example: '/opt/datagaze/agent' })
  path_to_main_file: string;

  @ApiProperty({ description: 'Mahsulotni ishga tushirish skripti', example: 'start.sh' })
  run_script: string;

  @ApiProperty({ description: 'Mahsulotni o\'rnatish skripti', example: 'install.sh' })
  install_script: string;

  @ApiProperty({ description: 'Mahsulot yaratilgan sana' })
  created_at: Date;

  @ApiProperty({ description: 'Mahsulot oxirgi yangilangan sana' })
  updated_at: Date;
}
