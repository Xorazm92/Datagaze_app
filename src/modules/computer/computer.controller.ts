import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComputerService } from './computer.service';
import { InstallApplicationDto, UpdateApplicationDto, RemoveApplicationDto } from './dto';

@ApiTags('Computers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('computers')
export class ComputerController {
  constructor(private readonly computerService: ComputerService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of computers' })
  @ApiResponse({ status: 200, description: 'List of computers retrieved successfully' })
  async getComputers() {
    return this.computerService.getComputers();
  }

  @Get(':computer_id/applications')
  @ApiOperation({ summary: 'Get installed applications on a computer' })
  @ApiResponse({ status: 200, description: 'List of installed applications retrieved' })
  async getComputerApplications(@Param('computer_id') computerId: string) {
    return this.computerService.getComputerApplications(computerId);
  }

  @Post(':computer_id/applications/install')
  @ApiOperation({ summary: 'Install new application on a computer' })
  @ApiResponse({ status: 201, description: 'Installation initiated successfully' })
  async installApplication(
    @Param('computer_id') computerId: string,
    @Body() installDto: InstallApplicationDto,
  ) {
    return this.computerService.installApplication(computerId, installDto);
  }

  @Put(':computer_id/applications/update')
  @ApiOperation({ summary: 'Update existing application' })
  @ApiResponse({ status: 200, description: 'Update process started successfully' })
  async updateApplication(
    @Param('computer_id') computerId: string,
    @Body() updateDto: UpdateApplicationDto,
  ) {
    return this.computerService.updateApplication(computerId, updateDto);
  }

  @Delete(':computer_id/applications/remove')
  @ApiOperation({ summary: 'Remove application from computer' })
  @ApiResponse({ status: 200, description: 'Application removal started successfully' })
  async removeApplication(
    @Param('computer_id') computerId: string,
    @Body() removeDto: RemoveApplicationDto,
  ) {
    return this.computerService.removeApplication(computerId, removeDto);
  }
}
