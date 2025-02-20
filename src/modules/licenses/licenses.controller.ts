import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetProductsDto, UploadLicenseDto } from './dto/license.dto';

@ApiTags('Licenses')
@Controller('api/licenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get installed products with licenses' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Server not found' })
  async getInstalledProducts(@Body() dto: GetProductsDto) {
    return this.licensesService.getInstalledProducts(dto);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload license file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('license_file'))
  @ApiResponse({ status: 200, description: 'License updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid license file' })
  async uploadLicense(
    @Body() dto: UploadLicenseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.licensesService.uploadLicense(dto, file);
  }

  @Get('alerts/exceed')
  @ApiOperation({ summary: 'Check for license exceed alerts' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved successfully' })
  async checkLicenseExceed() {
    return this.licensesService.checkLicenseExceed();
  }

  @Get('alerts/deadline')
  @ApiOperation({ summary: 'Check for license deadline alerts' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved successfully' })
  async checkLicenseDeadline() {
    return this.licensesService.checkLicenseDeadline();
  }
}
