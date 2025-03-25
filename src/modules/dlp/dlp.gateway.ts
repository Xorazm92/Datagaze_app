
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DlpGateway {
  @WebSocketServer()
  server: Server;

  sendDlpAlert(data: any) {
    this.server.emit('dlp_alert', data);
  }

  sendPolicyUpdate(data: any) {
    this.server.emit('policy_update', data);
  }
}
