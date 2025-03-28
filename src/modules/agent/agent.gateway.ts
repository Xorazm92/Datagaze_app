import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthForComputersGuard } from 'src/common/guards/jwt.auth.for.computers.guard';
import { AgentService } from './agent.service';

@WebSocketGateway({
    namespace: 'terminal',
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000', 'https://datagaze-front.vercel.app'],
        credentials: true,
    },
})
@UseGuards(JwtAuthForComputersGuard)
export class AgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private sshConnections = new Map<string, any>();

    constructor(
        private readonly agentService: AgentService,
    ) {}

    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        client.emit('message', { success: true, result: 'Connected to terminal server' });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        const ssh = this.sshConnections.get(client.id);
        if (ssh) {
            ssh.end();
            this.sshConnections.delete(client.id);
        }
    }

    @SubscribeMessage('connect_ssh')
    async handleSSHConnection(client: Socket, payload: any) {
        try {
            const ssh = await this.agentService.connectSSH(payload);
            this.sshConnections.set(client.id, ssh);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
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
    async handleCommand(client: Socket, payload: { command: string; agentId?: string }) {
        try {
            if (payload.agentId) {
                // Agent orqali buyruqni bajarish
                const result = await this.agentService.executeRemoteCommand(payload.agentId, payload.command);
                client.emit('command_response', { success: true, result, agentId: payload.agentId });
            } else {
                // Lokal buyruqni bajarish
                const result = await this.agentService.executeCommand(payload.command);
                client.emit('command_response', { success: true, result });
            }
        } catch (error) {
            client.emit('command_response', { success: false, result: error.message });
        }
    }

    @SubscribeMessage('install_product')
    async handleProductInstall(client: Socket, payload: { 
        agentId: string, 
        productId: string,
        version: string 
    }) {
        try {
            const result = await this.agentService.installProduct(
                payload.agentId,
                payload.productId,
                payload.version
            );
            client.emit('install_response', { success: true, result });
        } catch (error) {
            client.emit('install_response', { success: false, error: error.message });
        }
    }
}