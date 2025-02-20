import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Create a new admin' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Get all admins' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Get admin by id' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Update admin' })
  update(@Param('id') id: string, @Body() updateAdminDto: Partial<CreateAdminDto>) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Delete admin' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}