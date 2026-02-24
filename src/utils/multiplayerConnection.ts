import { Alert } from 'react-native';
import { ClientConnection } from '../multiplayer/ClientConnection';
import { useGameStore } from '../store/gameStore';

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
      case 'SERVER_STOPPED':
        handleServerStopped(router, message.payload.reason);
        break;
    }
  });
};

const handleServerStopped = (router: any, reason: string) => {
  // Check if this player is the host
  const { isHost, resetGame } = useGameStore.getState();

  // Only show alert to non-host players
  if (!isHost) {
    Alert.alert(
      'Game Ended',
      reason || 'The host has ended the game.',
      [
        {
          text: 'Back to Menu',
          onPress: () => {
            resetGame();
            router.replace('/' as any);
          },
        },
      ],
      { cancelable: false },
    );
  }
};
