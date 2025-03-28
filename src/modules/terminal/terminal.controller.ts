import { Body, Controller, Post } from '@nestjs/common';
import { TerminalService } from './terminal.service';

@Controller('terminal')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Terminal')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Post('connect')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Connect to SSH server' })
  async connect(@Body() connectionData: SSHConnectionDto) {
    return this.terminalService.connect(connectionData);
  }

  @Post('execute')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Execute SSH command' })
  async executeCommand(@Body() commandData: SSHCommandDto) {
    return this.terminalService.executeCommand(commandData);
  }

  @Post('disconnect')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Disconnect from SSH server' })
  async disconnect(@Body() connectionId: string) {
    return this.terminalService.disconnect(connectionId);
  }
  constructor(private readonly terminalService: TerminalService) {}

  @Post('connect')
  async connect(@Body() serverData: {
    host: string;
    port: number;
    username: string;
    password: string;
  }) {
    return this.terminalService.connectToSSH(serverData);
  }

  @Post('execute')
  async execute(
    @Body('sessionId') sessionId: string,
    @Body('command') command: string,
  ) {
    return this.terminalService.executeCommand(sessionId, command);
  }
}