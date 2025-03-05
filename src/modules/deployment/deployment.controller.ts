import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { InstallPackagesDto } from './dto/install-packages.dto';

@ApiTags('Deployment')
@Controller('deployment')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@ApiBearerAuth()
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post('install-packages')
  @ApiOperation({
    summary: 'Install packages on server',
    description: 'Install selected packages (DLP, SIEM, WAF) on the specified server. Only accessible by super admin.'
  })
  @ApiBody({
    type: InstallPackagesDto,
    examples: {
      success: {
        value: {
          serverId: 'aws-server',
          packages: ['dlp', 'siem', 'waf']
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Installation process started',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Installation process started' },
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or server not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Server not found or invalid package names' }
      }
    }
  })
  async installPackages(@Body() data: InstallPackagesDto) {
    try {
      const result = await this.deploymentService.installPackages(data.serverId, data.packages);
      return {
        success: true,
        message: 'Installation process started',
        data: result
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Installation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
