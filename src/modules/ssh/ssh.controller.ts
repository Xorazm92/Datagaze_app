import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SshService } from './ssh.service';
import { CreateSshDto } from './dto/create-ssh.dto';
import { Request } from 'express';

@ApiTags('SSH Connection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/1/ssh')
export class SshController {
  constructor(private readonly sshService: SshService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Test SSH connection and save credentials' })
  @ApiResponse({ status: 201, description: 'Connected successfully and credentials saved.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input or connection failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async connect(@Body(new ValidationPipe()) createSshDto: CreateSshDto, @Req() req: Request): Promise<object> {
    // req.user JWT payloadidan olinadi, tipi any qilib turamiz
    const user = req.user as any;
    return this.sshService.connectToServerCheck(createSshDto, user);
  }
}
