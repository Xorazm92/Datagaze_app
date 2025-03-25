
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
}
