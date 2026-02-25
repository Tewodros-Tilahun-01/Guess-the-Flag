import TcpSocket from 'react-native-tcp-socket';
import { GameMessage } from '../types/messages';
import { deserializeMessage, serializeMessage } from './messageTypes';

export class ClientConnection {
  private socket: any;
  private onMessage: (message: GameMessage) => void;
  private buffer: string = '';

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
        // console.log('Connected to server');

        // Send join message
        const joinMessage: GameMessage = {
          type: 'JOIN_GAME',
          payload: { playerId, playerName },
        };
        this.send(joinMessage);

        resolve();
      });

      this.socket.on('data', (data: Buffer) => {
        try {
          // Add incoming data to buffer
          this.buffer += data.toString();

          // Process complete messages (separated by newlines)
          const messages = this.buffer.split('\n');

          // Keep the last incomplete message in buffer
          this.buffer = messages.pop() || '';

          // Process each complete message
          messages.forEach((messageStr) => {
            if (messageStr.trim()) {
              try {
                const message = deserializeMessage(messageStr);
                this.onMessage(message);
              } catch (error) {
                console.error('Failed to parse message:', messageStr, error);
              }
            }
          });
        } catch (error) {
          console.error('Error processing data:', error);
        }
      });

      this.socket.on('close', () => {
        // console.log('Disconnected from server');
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
    this.buffer = '';
  }
}
