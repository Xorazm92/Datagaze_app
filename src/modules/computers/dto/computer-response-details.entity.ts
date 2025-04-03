import { ApiProperty } from '@nestjs/swagger';

class OSDetails {
  @ApiProperty({
    example: 'Windows 10',
    description: 'Operating system name',
  })
  os: string;

  @ApiProperty({
    example: 'Windows',
    description: 'Platform name',
  })
  platform: string;

  @ApiProperty({
    example: '19045',
    description: 'Build number',
  })
  build_number: string;

  @ApiProperty({
    example: '10.0',
    description: 'OS version',
  })
  version: string;
}

class ProcessorDetails {
  @ApiProperty({
    example: 'Intel Core i7',
    description: 'CPU model',
  })
  cpu: string;

  @ApiProperty({
    example: '8 cores',
    description: 'Number of cores',
  })
  core: string;

  @ApiProperty({
    example: '12th Gen',
    description: 'CPU generation',
  })
  generation: string;
}

class NetworkDetails {
  @ApiProperty({
    example: 'Ethernet',
    description: 'Network interface name',
  })
  nic_name: string;

  @ApiProperty({
    example: '192.168.1.100',
    description: 'IP address',
  })
  ip_address: string;

  @ApiProperty({
    example: '00:1B:44:11:3A:B7',
    description: 'MAC address',
  })
  mac_address: string;

  @ApiProperty({
    example: 'Yes',
    description: 'Network availability status',
  })
  available: string;

  @ApiProperty({
    example: 'Wired',
    description: 'Network type',
  })
  type: string;
}

class Drive {
  @ApiProperty({
    example: 'C:',
    description: 'Drive letter',
  })
  drive_name: string;

  @ApiProperty({
    example: '256 GB',
    description: 'Total drive size',
  })
  total_size: string;

  @ApiProperty({
    example: '128 GB',
    description: 'Free space',
  })
  free_size: string;
}

class MemoryStorageDetails {
  @ApiProperty({
    example: '16 GB',
    description: 'Total RAM',
  })
  ram: string;

  @ApiProperty({
    type: [Drive],
    description: 'List of drives',
  })
  drives: Drive[];
}

export class ComputerResponseDetailsEntity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the computer',
  })
  id: string;

  @ApiProperty({
    type: OSDetails,
    description: 'Operating system details',
  })
  os_details: OSDetails;

  @ApiProperty({
    type: ProcessorDetails,
    description: 'Processor details',
  })
  processor_details: ProcessorDetails;

  @ApiProperty({
    type: [NetworkDetails],
    description: 'Network interface details',
  })
  network_details: NetworkDetails[];

  @ApiProperty({
    type: MemoryStorageDetails,
    description: 'Memory and storage details',
  })
  memory_storage_details: MemoryStorageDetails;
}
