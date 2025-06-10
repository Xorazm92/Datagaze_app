import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AgentService } from '../agent.service';

@Injectable()
export class AgentAuthService {
    constructor(
        @Inject(forwardRef(() => AgentService)) private readonly agentService: AgentService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    return sign(payload, this.configService.get<string>('JWT_SECRET'), {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }
}
