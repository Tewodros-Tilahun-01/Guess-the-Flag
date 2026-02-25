import TcpSocket from 'react-native-tcp-socket';
import { GameEngine } from '../engine/GameEngine';
import { GameConfig, Player } from '../types/game';
import { GameMessage } from '../types/messages';
import { deserializeMessage, serializeMessage } from './messageTypes';

export class HostServer {
  private server: any;
  private clients: Map<string, any> = new Map();
  private gameEngine: GameEngine;
  private players: Player[] = [];
  private gameConfig: GameConfig;
  private timer: ReturnType<typeof setInterval> | null = null;
  private timeRemaining: number = 0;

  constructor(gameConfig: GameConfig) {
    this.gameEngine = new GameEngine();
    this.gameConfig = gameConfig;
  }

  start(port: number = 8080): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('Creating server...');
      this.server = TcpSocket.createServer((socket: any) => {
        console.log('Client connected');

        socket.on('data', (data: Buffer) => {
          const message = deserializeMessage(data.toString());
          this.handleMessage(socket, message);
        });

        socket.on('close', () => {
          console.log('Client disconnected');
          this.handleClientDisconnect(socket);
        });

        socket.on('error', (error: Error) => {
          console.error('Socket error:', error);
        });
      });

      if (!this.server) {
        const error = new Error(
          'Failed to create TCP server. TcpSocket.createServer() returned null. This may be a platform issue or missing permissions.',
        );
        console.error(error.message);
        reject(error);
        return;
      }

      console.log('Server created, attempting to listen...');

      this.server.listen({ port, host: '0.0.0.0' }, () => {
        const address = this.server.address();
        console.log(
          `✅ Server listening on ${address.address}:${address.port}`,
        );
        resolve(`${address.address}:${address.port}`);
      });

      this.server.on('error', (error: Error) => {
        console.error('Server error:', error);
        reject(error);
      });
    });
  }

  private handleMessage(socket: any, message: GameMessage): void {
    switch (message.type) {
      case 'JOIN_GAME':
        this.handleJoinGame(socket, message.payload);
        break;
      case 'PLAYER_READY':
        this.handlePlayerReady(message.payload);
        break;
      case 'SUBMIT_ANSWER':
        this.handleSubmitAnswer(message.payload);
        break;
    }
  }

  private handleJoinGame(
    socket: any,
    payload: { playerId: string; playerName: string },
  ): void {
    // Check if this is the first player (host)
    const isFirstPlayer = this.players.length === 0;

    const player: Player = {
      id: payload.playerId,
      name: payload.playerName,
      isReady: isFirstPlayer, // First player (host) is auto-ready
      isHost: isFirstPlayer, // First player is the host
    };

    this.players.push(player);
    this.clients.set(payload.playerId, socket);

    console.log(
      `Player joined: ${player.name} (${player.isHost ? 'Host' : 'Player'})`,
    );

    // Send game config to the newly joined player
    const configMessage: GameMessage = {
      type: 'GAME_CONFIG',
      payload: this.gameConfig,
    };
    socket.write(serializeMessage(configMessage));

    // Broadcast updated player list to everyone
    this.broadcastPlayerList();
  }

  private handlePlayerReady(payload: {
    playerId: string;
    isReady: boolean;
  }): void {
    const player = this.players.find((p) => p.id === payload.playerId);
    if (player) {
      player.isReady = payload.isReady;
      this.broadcastPlayerList();
    }
  }

  private handleSubmitAnswer(payload: {
    playerId: string;
    playerName: string;
    answer: string;
  }): void {
    const currentQuestion = this.gameEngine.getCurrentQuestion();
    if (!currentQuestion) return;

    const answer = this.gameEngine.createAnswer(
      currentQuestion.questionIndex,
      payload.playerId,
      payload.playerName,
      payload.answer,
      currentQuestion.country.name,
      currentQuestion.country.flag_file,
    );

    // TODO: Store or broadcast answer results
    console.log('Answer submitted:', answer);
  }

  private handleClientDisconnect(socket: any): void {
    for (const [playerId, clientSocket] of this.clients.entries()) {
      if (clientSocket === socket) {
        const player = this.players.find((p) => p.id === playerId);
        this.clients.delete(playerId);
        this.players = this.players.filter((p) => p.id !== playerId);

        // Broadcast player left notification
        if (player) {
          this.broadcast({
            type: 'PLAYER_LEFT',
            payload: {
              playerId: player.id,
              playerName: player.name,
            },
          });
        }

        this.broadcastPlayerList();
        break;
      }
    }
  }

  private broadcastPlayerList(): void {
    const message: GameMessage = {
      type: 'PLAYER_LIST_UPDATE',
      payload: { players: this.players },
    };
    this.broadcast(message);
  }

  broadcast(message: GameMessage): void {
    const data = serializeMessage(message);
    this.clients.forEach((socket) => {
      socket.write(data);
    });
  }

  async startGame(): Promise<void> {
    await this.gameEngine.generateQuestions(
      this.gameConfig.questionsCount,
      this.gameConfig.difficultyLevels,
    );

    this.broadcast({ type: 'GAME_START' });

    const question = this.gameEngine.getCurrentQuestion();
    if (question) {
      this.sendQuestion(question);
    }
  }

  private sendQuestion(question: any): void {
    this.timeRemaining = this.gameConfig.timePerQuestion;

    this.broadcast({
      type: 'NEW_QUESTION',
      payload: question,
    });

    this.startTimer();
  }

  private startTimer(): void {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.timeRemaining--;

      this.broadcast({
        type: 'TIME_UPDATE',
        payload: { timeRemaining: this.timeRemaining },
      });

      if (this.timeRemaining <= 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  nextQuestion(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    const question = this.gameEngine.nextQuestion();

    if (question) {
      this.sendQuestion(question);
    } else {
      this.endGame();
    }
  }

  private endGame(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.broadcast({
      type: 'GAME_END',
      payload: { answers: [] },
    });
  }

  updateConfig(config: GameConfig): void {
    this.gameConfig = config;
    this.broadcast({
      type: 'GAME_CONFIG',
      payload: config,
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Stopping server...');

      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      // Notify all clients that server is stopping

      this.broadcast({
        type: 'SERVER_STOPPED',
        payload: { reason: 'Host ended the game' },
      });

      this.clients.forEach((socket) => {
        try {
          socket.destroy();
        } catch (error) {
          console.error('Error destroying socket:', error);
        }
      });
      this.clients.clear();

      if (this.server) {
        try {
          this.server.close(() => {
            console.log('Server closed successfully');
            this.server = null;
            resolve();
          });
        } catch (error) {
          console.error('Error closing server:', error);
          this.server = null;
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
}
