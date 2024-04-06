import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsGateway implements OnGatewayConnection {
  private readonly connectedClients: Map<string, Socket> = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    console.log(clientId);
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
  }

  sendMessageToClients(message: string, socketId: string) {
    try {
      const socket = this.connectedClients.get(socketId);
      if (socket) {
        socket.emit('change_status', message);
        console.log(`Message sent to user ${socketId}:`, message);
      } else {
        console.error(`User ${socketId} not found`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
