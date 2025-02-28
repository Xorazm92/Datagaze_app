import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SSHService } from './ssh.service';
import { ConnectDto, StoreCredentialsDto } from './dto/ssh.dto';

@ApiTags('SSH')
@Controller('api/ssh')
@UseGuards(JwtAuthGuard)
export class SSHController {
  constructor(private readonly sshService: SSHService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect to SSH server' })
  @ApiResponse({ status: 200, description: 'Connected successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 503, description: 'Service unavailable' })
  async connect(@Body() connectDto: ConnectDto, @Request() req) {
    return this.sshService.connect(connectDto, req.user.id);
  }

  @Get(':server_id/status')
  @ApiOperation({ summary: 'Check SSH server status' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Server not found' })
  async checkStatus(@Param('server_id') serverId: string) {
    return this.sshService.checkStatus(serverId);
  }

  @Get(':server_id/errors')
  @ApiOperation({ summary: 'Get SSH connection errors' })
  @ApiResponse({ status: 200, description: 'Errors retrieved successfully' })
  async getErrors(@Param('server_id') serverId: string) {
    return this.sshService.getErrors(serverId);
  }

  @Post('store-credentials')
  @ApiOperation({ summary: 'Store SSH credentials' })
  @ApiResponse({ status: 201, description: 'Credentials stored successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async storeCredentials(@Body() credentialsDto: StoreCredentialsDto) {
    return this.sshService.storeCredentials(credentialsDto);
  }

  @Post(':server_id/auto-login')
  @ApiOperation({ summary: 'Auto login using stored credentials' })
  @ApiResponse({ status: 200, description: 'Auto login successful' })
  @ApiResponse({ status: 404, description: 'Server not found' })
  async autoLogin(@Param('server_id') serverId: string, @Request() req) {
    const server = await this.sshService.checkStatus(serverId);
    return this.sshService.connect({ server_id: serverId }, req.user.id);
  }
}
