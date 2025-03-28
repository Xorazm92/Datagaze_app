
import { Controller, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  @Put(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update application status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.applicationService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete application' })
  async deleteApplication(@Param('id') id: string) {
    return this.applicationService.deleteApplication(id);
  }
  @Put(':id/status')
  @ApiOperation({ summary: 'Update application status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.applicationService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application' })
  async deleteApplication(@Param('id') id: string) {
    return this.applicationService.deleteApplication(id);
  }
}
