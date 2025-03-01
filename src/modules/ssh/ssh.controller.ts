import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SSHService } from './ssh.service';
import { ConnectDto, StoreCredentialsDto } from './dto/ssh.dto';

@ApiTags('SSH')
@Controller('api/ssh')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SSHController {
  constructor(private readonly sshService: SSHService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect to SSH server' })
  @ApiResponse({
    status: 200,
    description: 'Connected successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            connection_id: { type: 'string', example: 'conn-123' },
            server_id: { type: 'string', example: 'srv-1001' },
            status: { type: 'string', example: 'connected' },
            connected_at: { type: 'string', example: '2025-02-28T10:30:00Z' }
          }
        }
      }
    }
  })
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
    status: 503,
    description: 'Service unavailable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'SSH service is currently unavailable' }
      }
    }
  })
  async connect(@Body() connectDto: ConnectDto, @Request() req) {
    return this.sshService.connect(connectDto, req.user.id);
  }

  @Get(':server_id/status')
  @ApiOperation({ summary: 'Check SSH server status' })
  @ApiResponse({
    status: 200,
    description: 'Status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            server_id: { type: 'string', example: 'srv-1001' },
            status: { type: 'string', example: 'online' },
            last_check: { type: 'string', example: '2025-02-28T10:30:00Z' },
            uptime: { type: 'number', example: 3600 }
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
        message: { type: 'string', example: 'Server with ID srv-1001 not found' }
      }
    }
  })
  async checkStatus(@Param('server_id') serverId: string) {
    return this.sshService.checkStatus(serverId);
  }

  @Get(':server_id/errors')
  @ApiOperation({ summary: 'Get SSH connection errors' })
  @ApiResponse({
    status: 200,
    description: 'Errors retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              error_id: { type: 'string', example: 'err-001' },
              timestamp: { type: 'string', example: '2025-02-28T10:30:00Z' },
              error_type: { type: 'string', example: 'connection_failed' },
              message: { type: 'string', example: 'Connection timed out' }
            }
          }
        }
      }
    }
  })
  async getErrors(@Param('server_id') serverId: string) {
    return this.sshService.getErrors(serverId);
  }

  @Post('store-credentials')
  @ApiOperation({ summary: 'Store SSH credentials' })
  @ApiResponse({
    status: 201,
    description: 'Credentials stored successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            server_id: { type: 'string', example: 'srv-1001' },
            name: { type: 'string', example: 'Production Server' },
            ip: { type: 'string', example: '192.168.1.100' },
            stored_at: { type: 'string', example: '2025-02-28T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Invalid credentials format' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'password' },
              message: { type: 'string', example: 'Password is required for password authentication' }
            }
          }
        }
      }
    }
  })
  async storeCredentials(@Body() credentialsDto: StoreCredentialsDto) {
    return this.sshService.storeCredentials(credentialsDto);
  }

  @Post(':server_id/auto-login')
  @ApiOperation({ summary: 'Auto login using stored credentials' })
  @ApiResponse({
    status: 200,
    description: 'Auto login successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            connection_id: { type: 'string', example: 'conn-123' },
            server_id: { type: 'string', example: 'srv-1001' },
            status: { type: 'string', example: 'connected' },
            connected_at: { type: 'string', example: '2025-02-28T10:30:00Z' }
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
        message: { type: 'string', example: 'No stored credentials found for server srv-1001' }
      }
    }
  })
  async autoLogin(@Param('server_id') serverId: string, @Request() req) {
    const server = await this.sshService.checkStatus(serverId);
    return this.sshService.connect({ server_id: serverId }, req.user.id);
  }
}
