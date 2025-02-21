import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ComputersService } from './computers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  InstallApplicationDto,
  UpdateApplicationDto,
  RemoveApplicationDto,
} from './dto/computer.dto';

@ApiTags('Computers')
@Controller('api/computers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all computers' })
  @ApiResponse({
    status: 200,
    description: 'List of computers retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'comp-001' },
              hostname: { type: 'string', example: 'PC-User1' },
              ip_address: { type: 'string', example: '192.168.1.10' },
              status: { type: 'string', example: 'active' },
              last_seen: { type: 'string', example: '2025-02-11T14:30:00Z' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example: 'Unauthorized. Please provide a valid token.',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example: 'Internal server error. Please try again later.',
        },
      },
    },
  })
  async getAllComputers() {
    return this.computersService.getAllComputers();
  }

  @Get(':computerId/applications')
  @ApiOperation({ summary: 'Get list of installed applications on a computer' })
  @ApiResponse({
    status: 200,
    description: 'List of applications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              app_id: { type: 'string', example: 'app-101' },
              name: { type: 'string', example: 'Google Chrome' },
              version: { type: 'string', example: '121.0.1' },
              install_date: { type: 'string', example: '2025-01-15' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Computer not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Computer not found.' },
      },
    },
  })
  async getInstalledApplications(@Param('computerId') computerId: string) {
    return this.computersService.getInstalledApplications(computerId);
  }

  @Post(':computerId/applications/install')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Install new application on a computer' })
  @ApiResponse({
    status: 201,
    description: 'Installation initiated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Installation initiated successfully.',
        },
        task_id: { type: 'string', example: 'task-5001' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Computer is offline',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example:
            'The selected computer is offline. Installation cannot proceed.',
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid installer URL',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Invalid installer URL provided.' },
      },
    },
  })
  async installApplication(
    @Param('computerId') computerId: string,
    @Body() dto: InstallApplicationDto,
  ) {
    return this.computersService.installApplication(computerId, dto);
  }

  @Put(':computerId/applications/update')
  @ApiOperation({ summary: 'Update existing application on a computer' })
  @ApiResponse({
    status: 200,
    description: 'Update process started successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Update process started successfully.',
        },
        task_id: { type: 'string', example: 'task-6002' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example: 'Application not found on the target computer.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Update URL not reachable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example: 'Failed to download update from the provided URL.',
        },
      },
    },
  })
  async updateApplication(
    @Param('computerId') computerId: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.computersService.updateApplication(computerId, dto);
  }

  @Delete(':computerId/applications/remove')
  @ApiOperation({ summary: 'Remove application from a computer' })
  @ApiResponse({
    status: 200,
    description: 'Application removal started successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Application removal started successfully.',
        },
        task_id: { type: 'string', example: 'task-7003' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example: 'The specified application was not found on the computer.',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Application removal failure',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example: 'Failed to remove the application due to a system error.',
        },
      },
    },
  })
  async removeApplication(
    @Param('computerId') computerId: string,
    @Body() dto: RemoveApplicationDto,
  ) {
    return this.computersService.removeApplication(computerId, dto);
  }
}
