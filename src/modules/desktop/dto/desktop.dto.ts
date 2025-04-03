import { ApiProperty } from '@nestjs/swagger';

export class InstallWebApplicationDto {
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
    description: 'Username for SSH access',
    example: 'root',
  })
  username: string;

  @ApiProperty({
    description: 'Password for SSH access',
    example: 'Datagaze2134$Platform',
  })
  password: string;
}

export class WebApplicationEntity {
  @ApiProperty({
    description: 'Unique identifier',
    example: '832f6fa7-dad4-430a-9206-5fb118d36f26',
  })
  id: string;

  @ApiProperty({
    description: 'Application name',
    example: 'DLP',
  })
  application_name: string;

  @ApiProperty({
    description: 'Application version',
    example: '4.7.2',
  })
  version: string;

  @ApiProperty({
    description: 'Path to application icon',
    example: '/dlp.png',
  })
  pathToIcon: string;

  @ApiProperty({
    description: 'Whether the application is installed',
    example: false,
  })
  is_installed: boolean;
}

export class WebApplicationDetailsEntity extends WebApplicationEntity {
  @ApiProperty({
    description: 'Application publisher',
    example: 'Datagaze LLC',
  })
  publisher: string;

  @ApiProperty({
    description: 'Application release date',
    example: '02.12.2022',
  })
  release_date: string;

  @ApiProperty({
    description: 'CPU requirements',
    example: '2-cores',
  })
  cpu: string;

  @ApiProperty({
    description: 'RAM requirements',
    example: '4 GB',
  })
  ram: string;

  @ApiProperty({
    description: 'Storage requirements',
    example: '128 GB SSD',
  })
  storage: string;

  @ApiProperty({
    description: 'Network bandwidth requirements',
    example: '1 Gbps Ethernet Port',
  })
  network_bandwidth: string;
}
