import { Controller, Get, Param, Query, UseGuards, Post, Body, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
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
// Added imports for new endpoints
import { InstallApplicationDto } from './dto/install-application.dto'; // Assumed DTO
import { UpdateApplicationDto } from './dto/update-application.dto'; // Assumed DTO


@ApiTags('Devices')
@Controller('/1/device')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Get(':id/applications')
  @ApiOperation({ summary: 'Get list of installed applications' })
  async getInstalledApplications(@Param('id') computerId: string) {
    return this.computersService.getInstalledApplications(computerId);
  }

  @Post(':id/applications/install')
  @ApiOperation({ summary: 'Install new application' })
  async installApplication(
    @Param('id') computerId: string,
    @Body() installDto: InstallApplicationDto,
  ) {
    return this.computersService.installApplication(computerId, installDto);
  }

  @Put(':id/applications/:appId')
  @ApiOperation({ summary: 'Update installed application' })
  async updateApplication(
    @Param('id') computerId: string,
    @Param('appId') appId: string,
    @Body() updateDto: UpdateApplicationDto,
  ) {
    return this.computersService.updateApplication(computerId, appId, updateDto);
  }

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


  @Get(':computerId/applications')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN) // Added role protection
  @ApiOperation({ summary: 'Get installed applications' })
  async getInstalledApplications(@Param('computerId') computerId: string) {
    try {
      const applications = await this.computersService.getInstalledApplications(computerId);
      return { success: true, data: applications };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':computerId/applications/install')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN) // Added role protection
  @ApiOperation({ summary: 'Install new application' })
  async installApplication(
    @Param('computerId') computerId: string,
    @Body() installDto: InstallApplicationDto,
  ) {
    try {
      await this.computersService.installApplication(computerId, installDto);
      return { success: true, message: 'Installation started' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':computerId/applications/:appId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN) // Added role protection
  @ApiOperation({ summary: 'Update installed application' })
  async updateApplication(
    @Param('computerId') computerId: string,
    @Param('appId') appId: string,
    @Body() updateDto: UpdateApplicationDto,
  ) {
    return this.computersService.updateApplication(computerId, appId, updateDto);
  }

  @Delete(':computerId/applications/:appId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN) // Added role protection
  @ApiOperation({ summary: 'Remove installed application' })
  async removeApplication(
    @Param('computerId') computerId: string,
    @Param('appId') appId: string,
  ) {
    return this.computersService.removeApplication(computerId, appId);
  }
}