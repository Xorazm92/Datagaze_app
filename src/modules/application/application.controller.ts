import { Controller, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationService } from './application.service';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  @Put(':id/status')
  @ApiOperation({ summary: 'Update application status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.applicationService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application' })
  async deleteApplication(@Param('id') id: string) {
    return this.applicationService.deleteApplication(id);
  }
}