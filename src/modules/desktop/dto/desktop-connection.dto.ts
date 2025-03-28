
import { ApiProperty } from '@nestjs/swagger';

export class DesktopConnectionDto {
  @ApiProperty({
    description: 'Host address',
    example: '209.38.250.43',
  })
  host: string;

  @ApiProperty({
    description: 'Port number',
    example: 22,
  })
  port: number;

  @ApiProperty({
    description: 'Username for remote access',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: 'Password for remote access',
    example: 'password123',
  })
  password: string;
}
