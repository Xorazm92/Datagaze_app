import { Controller, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { SuperAdminService } from './super-admin.service';

@Controller('api/super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@ApiTags('Super Admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Put('admins/:adminId/status')
  @ApiOperation({ summary: 'Update admin status' })
  async updateAdminStatus(
    @Param('adminId') adminId: string,
    @Body('status') status: string,
  ) {
    return this.superAdminService.updateAdminStatus(adminId, status);
  }

  @Delete('admins/:adminId')
  @ApiOperation({ summary: 'Delete admin' })
  async deleteAdmin(@Param('adminId') adminId: string) {
    return this.superAdminService.deleteAdmin(adminId);
  }
}