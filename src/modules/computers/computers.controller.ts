import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ComputersService } from './computers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ComputerEntity } from '@computers/dto/computer.entity';
import { ComputerResponseDetailsEntity } from '@computers/dto/computer-response-details.entity';
import { ComputerAppEntity } from '@computers/dto/computer-app.entity';

@ApiTags('Devices')
@Controller('api/1/device')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Get('computers')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get all computers' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of records per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive'],
    description: 'Filter by status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of computers with their drives',
    type: [ComputerEntity],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Failed to fetch computers' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getAllComputers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: 'active' | 'inactive',
  ): Promise<ComputerEntity[]> {
    return this.computersService.getAllComputers(page, limit, status);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get computer by ID' })
  @ApiParam({ name: 'id', description: 'Computer ID' })
  @ApiResponse({
    status: 200,
    description: 'Computer details with drives',
    type: ComputerResponseDetailsEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Computer Not Found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Computer with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to fetch computer details',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getComputerById(
    @Param('id') id: string,
  ): Promise<ComputerResponseDetailsEntity> {
    return this.computersService.getComputerById(id);
  }

  @Get(':id/apps')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get computer applications by ID' })
  @ApiParam({ name: 'id', description: 'Computer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of applications installed on the computer',
    type: [ComputerAppEntity],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Computer Not Found',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Computer with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to fetch computer applications',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getComputerApps(@Param('id') id: string): Promise<ComputerAppEntity[]> {
    return this.computersService.getComputerApps(id);
  }
}
