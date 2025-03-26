import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DesktopService } from './desktop.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  InstallWebApplicationDto,
  WebApplicationEntity,
  WebApplicationDetailsEntity,
} from './dto/desktop.dto';

@ApiTags('Desktop')
@Controller('/1/desktop')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DesktopController {
  constructor(private readonly desktopService: DesktopService) {}

  @Get('web-applications')
  @ApiOperation({ summary: 'List of Web Applications' })
  @ApiResponse({
    status: 200,
    description: 'List of Web Applications',
    type: [WebApplicationEntity],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to fetch web applications',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  findAllWebApplications() {
    return this.desktopService.findAllWebApplications();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Web Application by ID' })
  @ApiParam({ name: 'id', description: 'Web Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Web Application',
    type: WebApplicationDetailsEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Web Application Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Web Application with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to fetch web application details',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  findWebApplicationById(@Param('id') id: string) {
    return this.desktopService.findWebApplicationById(id);
  }

  @Post('install/:id')
  @ApiOperation({ summary: 'Install Web Application' })
  @ApiParam({ name: 'id', description: 'Web Application ID' })
  @ApiBody({ type: InstallWebApplicationDto })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Web Application Installed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Web Application Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Web Application with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to install web application',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async installWebApplication(
    @Param('id') id: string,
    @Body() installWebApplicationDto: InstallWebApplicationDto,
  ) {
    await this.desktopService.installWebApplication(
      id,
      installWebApplicationDto,
    );
    return {
      status: 'success',
      message: 'Web Application installed successfully',
    };
  }

  @Delete('uninstall/:id')
  @ApiOperation({ summary: 'Uninstall Web Application' })
  @ApiParam({ name: 'id', description: 'Web Application ID' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Web Application Uninstalled',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Unauthorized access' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Web Application Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Web Application with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to uninstall web application',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async uninstallWebApplication(@Param('id') id: string) {
    await this.desktopService.uninstallWebApplication(id);
    return {
      status: 'success',
      message: 'Web Application uninstalled successfully',
    };
  }
}
