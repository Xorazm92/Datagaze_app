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
  ApiBody,
} from '@nestjs/swagger';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetProductsDto, UploadLicenseDto } from './dto/license.dto';

@ApiTags('Licenses')
@Controller('api/licenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'Unauthorized access' }
    }
  }
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'An unexpected error occurred' }
    }
  }
})
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('products')
  @ApiOperation({
    summary: 'Get installed products with licenses',
    description: 'Get a list of all installed products and their license information'
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'prod-001' },
              name: { type: 'string', example: 'Adobe Creative Suite' },
              version: { type: 'string', example: '2024' },
              license_type: { type: 'string', example: 'subscription' },
              expiry_date: { type: 'string', example: '2026-02-28T00:00:00Z' },
              seats: { type: 'number', example: 50 },
              used_seats: { type: 'number', example: 35 }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Server not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Server not found' }
      }
    }
  })
  async getInstalledProducts(@Body() dto: GetProductsDto) {
    return this.licensesService.getInstalledProducts(dto);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Upload license file',
    description: 'Upload a new license file for a product'
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('license_file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        license_file: {
          type: 'string',
          format: 'binary',
          description: 'License file to upload'
        },
        product_id: {
          type: 'string',
          example: 'prod-001',
          description: 'ID of the product to update license'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'License updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            product_id: { type: 'string', example: 'prod-001' },
            license_id: { type: 'string', example: 'lic-001' },
            expiry_date: { type: 'string', example: '2026-02-28T00:00:00Z' },
            seats: { type: 'number', example: 100 },
            updated_at: { type: 'string', example: '2025-02-28T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid license file',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Invalid license file format' }
      }
    }
  })
  async uploadLicense(
    @Body() dto: UploadLicenseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.licensesService.uploadLicense(dto, file);
  }

  @Get('alerts/exceed')
  @ApiOperation({
    summary: 'Check for license exceed alerts',
    description: 'Get alerts for products where license usage exceeds the limit'
  })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product_id: { type: 'string', example: 'prod-001' },
              name: { type: 'string', example: 'Adobe Photoshop' },
              license_limit: { type: 'number', example: 50 },
              current_usage: { type: 'number', example: 55 },
              exceed_count: { type: 'number', example: 5 },
              alert_level: { type: 'string', example: 'critical' }
            }
          }
        }
      }
    }
  })
  async checkLicenseExceed() {
    return this.licensesService.checkLicenseExceed();
  }

  @Get('alerts/deadline')
  @ApiOperation({
    summary: 'Check for license deadline alerts',
    description: 'Get alerts for products with licenses approaching expiration'
  })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product_id: { type: 'string', example: 'prod-001' },
              name: { type: 'string', example: 'Adobe Photoshop' },
              expiry_date: { type: 'string', example: '2025-03-15T00:00:00Z' },
              days_remaining: { type: 'number', example: 15 },
              alert_level: { type: 'string', example: 'warning' }
            }
          }
        }
      }
    }
  })
  async checkLicenseDeadline() {
    return this.licensesService.checkLicenseDeadline();
  }
}
