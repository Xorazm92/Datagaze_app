import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { TerminalService, SSHConnectionData } from './terminal.service';

export class SSHCommandDto {
  sessionId: string;
  command: string;
}

@Controller('terminal')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Terminal')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Post('connect')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Connect to SSH server' })
  async connect(@Body() connectionData: SSHConnectionData): Promise<string> {
    return this.terminalService.connect(connectionData);
  }

  @Post('execute')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Execute SSH command' })
  async executeCommand(@Body() commandData: SSHCommandDto): Promise<string> {
    return this.terminalService.executeCommand(
      commandData.sessionId,
      commandData.command,
    );
  }

  @Get('history/:sessionId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get command history' })
  async getCommandHistory(@Param('sessionId') sessionId: string): Promise<string[]> {
    return this.terminalService.getCommandHistory(sessionId);
  }

  @Post('disconnect')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Disconnect from SSH server' })
  async disconnect(@Body('sessionId') sessionId: string): Promise<void> {
    return this.terminalService.disconnect(sessionId);
  }
}