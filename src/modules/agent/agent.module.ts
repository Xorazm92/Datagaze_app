import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentGateway } from './agent.gateway';
import { AgentAuthService } from './service/agent.auth.service';

@Module({
    controllers: [AgentController],
    providers: [AgentService, AgentGateway, AgentAuthService],
        exports: [AgentService, AgentAuthService],
})
export class AgentModule {}