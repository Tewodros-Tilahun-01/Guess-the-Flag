import { getMultiplayerConnection } from '@/src/utils/connectionManager';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useGameStore } from '../store/gameStore';

export const useBackHandler = () => {
  const router = useRouter();
  const { gameMode, isHost, resetGame } = useGameStore();

  useEffect(() => {
    if (gameMode === 'multiplayer') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }
  }, [gameMode, isHost]);

  const handleBackPress = () => {
    if (gameMode === 'multiplayer') {
      const message = isHost
        ? 'Do you want to end this game? All players will be disconnected.'
        : 'Do you want to leave this game?';

      Alert.alert(isHost ? 'End Game?' : 'Leave Game?', message, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: isHost ? 'End Game' : 'Leave',
          style: 'destructive',
          onPress: () => {
            const connection = getMultiplayerConnection();
            if (connection) {
              connection.disconnect();
            }
            resetGame();
            router.dismissTo('/multiplayer-menu' as any);
          },
        },
      ]);
      return true; // Prevent default back behavior
    }
    return false; // Allow default back behavior for single player
  };
};
