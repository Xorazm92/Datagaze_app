
import { ApiProperty } from '@nestjs/swagger';

export class DesktopConnectionDto {
  @ApiProperty({
    description: 'Host address',
    example: '209.38.250.43'
  })
  host: string;

  @ApiProperty({
    description: 'Port number',
    example: 22
  })
  port: number;

  @ApiProperty({
    description: 'Username for remote access',
    example: 'root'
  })
  username: string;

  @ApiProperty({
    description: 'Password for remote access',
    example: 'Datagaze2134$Platform'
  })
  password: string;
}

export class CreateWebApplicationDto {
  @ApiProperty({
    description: 'Icon of Product',
    type: 'string',
    format: 'binary'
  })
  icon: Express.Multer.File;

  @ApiProperty({
    description: 'Name of Product'
  })
  applicationName: string;

  @ApiProperty({
    description: 'Publisher of Product'
  })
  publisher: string;

  @ApiProperty({
    description: 'Version of Web Product'
  })
  webVersion: string;

  @ApiProperty({
    description: 'Version of Agent Product'
  })
  agentVersion: string;

  @ApiProperty({
    description: 'Install Scripts in text form'
  })
  installScript: string;

  @ApiProperty({
    description: 'Any type of server-side file',
    type: 'string',
    format: 'binary'
  })
  serverFile: Express.Multer.File;

  @ApiProperty({
    description: 'Any type of client-side file',
    type: 'string',
    format: 'binary'
  })
  agentFile: Express.Multer.File;
}
