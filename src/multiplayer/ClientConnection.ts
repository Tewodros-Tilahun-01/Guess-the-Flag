import TcpSocket from 'react-native-tcp-socket';
import { GameMessage } from '../types/messages';
import { deserializeMessage, serializeMessage } from './messageTypes';

export class ClientConnection {
  private socket: any;
  private onMessage: (message: GameMessage) => void;

  constructor(onMessage: (message: GameMessage) => void) {
    this.onMessage = onMessage;
  }

  connect(
    host: string,
    port: number,
    playerId: string,
    playerName: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = TcpSocket.createConnection({ host, port }, () => {
        console.log('Connected to server');

        // Send join message
        const joinMessage: GameMessage = {
          type: 'JOIN_GAME',
          payload: { playerId, playerName },
        };
        this.send(joinMessage);

        resolve();
      });

      this.socket.on('data', (data: Buffer) => {
        const message = deserializeMessage(data.toString());
        this.onMessage(message);
      });

      this.socket.on('close', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('error', (error: Error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  send(message: GameMessage): void {
    if (this.socket) {
      const data = serializeMessage(message);
      this.socket.write(data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }
}
