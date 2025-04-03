import { ApiProperty } from '@nestjs/swagger';

export class ComputerAppEntity {
  @ApiProperty({
    example: '6c8f35c8-f578-40a2-9723-6fcec8765a7e',
    description: 'Unique identifier of the application',
  })
  id: string;

  @ApiProperty({
    example: 'Slack',
    description: 'Name of the application',
  })
  name: string;

  @ApiProperty({
    example: '128 MB',
    description: 'Size of the application',
  })
  file_size: string;

  @ApiProperty({
    example: 'user',
    description: 'Type of installation',
    enum: ['user', 'system'],
  })
  installation_type: string;

  @ApiProperty({
    example: '2023-10-04T19:00:00.000Z',
    description: 'Date when the application was installed',
  })
  installed_date: string;
}
