
import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DesktopService } from './desktop.service';
import { DesktopConnectionDto, CreateWebApplicationDto } from './dto/desktop-connection.dto';

@ApiTags('Desktop')
@Controller('api/1/desktop')
export class DesktopController {
  constructor(private readonly desktopService: DesktopService) {}

  @Get('web-applications')
  @ApiOperation({ summary: 'List of Web Applications' })
  @ApiResponse({ status: 200, description: 'List of Web Applications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findAllWebApplications() {
    return this.desktopService.findAllWebApplications();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Web Application by ID' })
  @ApiResponse({ status: 200, description: 'Web Application' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Web Application Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findWebApplicationById(@Param('id') id: string) {
    return this.desktopService.findWebApplicationById(id);
  }

  @Post('install/:id')
  @ApiOperation({ summary: 'Install Web Application' })
  @ApiResponse({ status: 200, description: 'Web Application Installed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Web Application Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  install(@Param('id') id: string, @Body() connectionDto: DesktopConnectionDto) {
    return this.desktopService.installWebApplication(id, connectionDto);
  }

  @Delete('uninstall/:id')
  @ApiOperation({ summary: 'Uninstall Web Application' })
  @ApiResponse({ status: 200, description: 'Web Application Uninstalled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Web Application Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  uninstall(@Param('id') id: string) {
    return this.desktopService.uninstallWebApplication(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Web Application' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'icon', maxCount: 1 },
    { name: 'serverFile', maxCount: 1 },
    { name: 'agentFile', maxCount: 1 },
  ]))
  @ApiResponse({ status: 201, description: 'Web Application Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createDto: CreateWebApplicationDto, @UploadedFiles() files: any) {
    return this.desktopService.createWebApplication(createDto, files);
  }

  @Post('transfer/:id')
  @ApiOperation({ summary: 'Transfer Web Application' })
  @ApiResponse({ status: 200, description: 'Web Application Transferred to Given IP' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Web Application Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  transfer(@Param('id') id: string, @Body() connectionDto: DesktopConnectionDto) {
    return this.desktopService.transferWebApplication(id, connectionDto);
  }
}
