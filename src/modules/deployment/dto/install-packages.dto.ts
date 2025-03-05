import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize, IsIn } from 'class-validator';

export class InstallPackagesDto {
  @ApiProperty({
    description: 'ID of the target server',
    example: 'aws-server'
  })
  @IsString()
  serverId: string;

  @ApiProperty({
    description: 'List of packages to install',
    example: ['dlp', 'siem', 'waf'],
    type: [String]
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(['dlp', 'siem', 'waf'], { each: true })
  packages: string[];
}
