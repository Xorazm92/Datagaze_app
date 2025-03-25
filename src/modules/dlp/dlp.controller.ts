
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DlpService } from './dlp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('DLP')
@Controller('dlp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DlpController {
  constructor(private readonly dlpService: DlpService) {}

  @Get('policies')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all DLP policies' })
  async getPolicies() {
    return this.dlpService.getPolicies();
  }

  @Post('policies')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new DLP policy' })
  async createPolicy(@Body() policyData: any) {
    return this.dlpService.createPolicy(policyData);
  }

  @Get('reports')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get DLP reports' })
  async getReports() {
    return this.dlpService.getReports();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get DLP statistics' })
  async getStatistics() {
    return this.dlpService.getStatistics();
  }

  @Get('policies/:id')
  @ApiOperation({ summary: 'Get single DLP policy' })
  async getPolicy(@Param('id') id: string) {
    return this.dlpService.getPolicy(id);
  }

  @Put('policies/:id')
  @ApiOperation({ summary: 'Update DLP policy' })
  async updatePolicy(@Param('id') id: string, @Body() policyData: any) {
    return this.dlpService.updatePolicy(id, policyData);
  }

  @Delete('policies/:id')
  @ApiOperation({ summary: 'Delete DLP policy' })
  async deletePolicy(@Param('id') id: string) {
    return this.dlpService.deletePolicy(id);
  }

  @Post('policies/:id/toggle')
  @ApiOperation({ summary: 'Toggle policy status' })
  async togglePolicy(@Param('id') id: string) {
    return this.dlpService.togglePolicy(id);
  }
}
