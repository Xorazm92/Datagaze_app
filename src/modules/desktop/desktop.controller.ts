import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DesktopService } from './desktop.service';
import { DesktopConnectionDto } from './dto/desktop-connection.dto';
import { DesktopEntity } from './entities/desktop.entity';

@ApiTags('Desktop')
@Controller('api/desktop')
export class DesktopController {
  constructor(private readonly desktopService: DesktopService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect to a desktop' })
  @ApiResponse({ status: 201, description: 'Successfully connected', type: DesktopEntity })
  connect(@Body() connectionDto: DesktopConnectionDto) {
    return this.desktopService.connect(connectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all connected desktops' })
  @ApiResponse({ status: 200, description: 'List of desktops', type: [DesktopEntity] })
  findAll() {
    return this.desktopService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get desktop by ID' })
  @ApiResponse({ status: 200, description: 'Desktop details', type: DesktopEntity })
  findOne(@Param('id') id: string) {
    return this.desktopService.findOne(id);
  }

  @Put(':id/disconnect')
  @ApiOperation({ summary: 'Disconnect a desktop' })
  @ApiResponse({ status: 200, description: 'Desktop disconnected' })
  disconnect(@Param('id') id: string) {
    return this.desktopService.disconnect(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove desktop' })
  @ApiResponse({ status: 200, description: 'Desktop removed' })
  remove(@Param('id') id: string) {
    return this.desktopService.remove(id);
  }
}