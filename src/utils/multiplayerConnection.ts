import { ClientConnection } from '../multiplayer/ClientConnection';

// Shared connection logic for both host and players
export const createMultiplayerConnection = (
  router: any,
  setPlayers: (players: any[]) => void,
  setGameConfig: (config: any) => void,
  setGameState: (state: any) => void,
  setCurrentQuestion: (question: any) => void,
  setTimeRemaining: (time: number) => void,
) => {
  return new ClientConnection((message) => {
    switch (message.type) {
      case 'PLAYER_LIST_UPDATE':
        setPlayers(message.payload.players);
        break;
      case 'GAME_CONFIG':
        setGameConfig(message.payload);
        break;
      case 'GAME_START':
        setGameState('playing');
        router.push('/game' as any);
        break;
      case 'NEW_QUESTION':
        setCurrentQuestion(message.payload);
        break;
      case 'TIME_UPDATE':
        setTimeRemaining(message.payload.timeRemaining);
        break;
      case 'GAME_END':
        setGameState('ended');
        router.push('/result' as any);
        break;
    }
  });
};
