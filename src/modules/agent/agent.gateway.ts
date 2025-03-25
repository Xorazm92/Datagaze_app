import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthForComputersGuard } from 'src/common/guards/jwt.auth.for.computers.guard';
import { AgentService } from './agent.service';

@WebSocketGateway({
    namespace: 'terminal',
    cors: {
        origin: '*',
    },
})
@UseGuards(JwtAuthForComputersGuard)
export class AgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly agentService: AgentService) {}

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        client.emit('message', { success: true, result: 'Connected to terminal server' });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('command')
    async handleCommand(client: Socket, payload: { command: string }) {
        try {
            const result = await this.agentService.executeCommand(payload.command);
            client.emit('command_response', { success: true, result });
        } catch (error) {
            client.emit('command_response', { success: false, result: error.message });
        }
    }
}