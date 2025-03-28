import { Body, Controller, Post } from '@nestjs/common';
import { TerminalService } from './terminal.service';

@Controller('terminal')
export class TerminalController {
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