import { ApiProperty } from '@nestjs/swagger';

export class ComputerEntity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the computer',
  })
  id: string;

  @ApiProperty({
    example: 'DESKTOP-ABC123',
    description: 'Name of the computer',
  })
  computer_name: string;

  @ApiProperty({
    example: 'Windows 10',
    description: 'Operating system of the computer',
  })
  os: string;

  @ApiProperty({
    example: '192.168.1.100',
    description: 'IP address of the computer',
  })
  ip_address: string;

  @ApiProperty({
    example: 'active',
    description: 'Status of the computer',
    enum: ['active', 'inactive'],
  })
  status: string;
}
