
import { ApiProperty } from '@nestjs/swagger';

export class DesktopEntity {
  @ApiProperty({
    description: 'Desktop ID',
    example: '1'
  })
  id: string;

  @ApiProperty({
    description: 'Desktop name',
    example: 'Main Workstation'
  })
  name: string;

  @ApiProperty({
    description: 'Connection status',
    example: true
  })
  is_connected: boolean;

  @ApiProperty({
    description: 'IP address',
    example: '192.168.1.100'
  })
  ip_address: string;

  @ApiProperty({
    description: 'Operating system',
    example: 'Windows 10'
  })
  os: string;

  @ApiProperty({
    description: 'Last connection time',
    example: '2024-01-23T12:00:00Z'
  })
  last_connected: Date;
}
