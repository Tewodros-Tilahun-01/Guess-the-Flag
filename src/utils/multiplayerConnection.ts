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
  setPlayerLeftNotification: (playerName: string | null) => void,
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
        // Update the question index when receiving new question
        if (message.payload && message.payload.questionIndex !== undefined) {
          useGameStore
            .getState()
            .setCurrentQuestionIndex(message.payload.questionIndex);
        }
        break;
      case 'TIME_UPDATE':
        setTimeRemaining(message.payload.timeRemaining);
        break;
      case 'GAME_END':
        // Store all answers from server (already in correct format!)
        useGameStore.getState().setPlayerAnswers(message.payload.allAnswers);
        setGameState('ended');
        router.replace('/result' as any);
        break;
      case 'SERVER_STOPPED':
        handleServerStopped(router, message.payload.reason);
        break;
      case 'PLAYER_LEFT':
        setPlayerLeftNotification(message.payload.playerName);
        break;
    }
  });
};

const handleServerStopped = (router: any, reason: string) => {
  const { resetGame } = useGameStore.getState();

  Alert.alert(
    'Game Ended',
    reason || 'The host has ended the game.',
    [
      {
        text: 'Back to Menu',
        onPress: () => {
          resetGame();
          router.dismissTo('/' as any);
        },
      },
    ],
    { cancelable: false },
  );
};
