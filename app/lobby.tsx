import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HostAnnouncer } from '../src/multiplayer/HostDiscovery';
import { HostServer } from '../src/multiplayer/HostServer';
import { useGameStore } from '../src/store/gameStore';
import { getLocalIpAddress } from '../src/utils/network';
import { clientConnection } from './join-game';

let hostServer: HostServer | null = null;
let hostAnnouncer: HostAnnouncer | null = null;

export default function Lobby() {
  const router = useRouter();
  const {
    isHost,
    playerName,
    players,
    gameConfig,
    setPlayers,
    setGameState,
    setTimeRemaining,
    addAnswer,
  } = useGameStore();
  const [isReady, setIsReady] = useState(false);
  const [serverAddress, setServerAddress] = useState('');

  useEffect(() => {
    if (isHost) {
      startHostServer();
    }

    return () => {
      // Cleanup on unmount
      if (hostAnnouncer) {
        hostAnnouncer.stopAnnouncing();
        hostAnnouncer = null;
      }
    };
  }, []);

  const startHostServer = async () => {
    console.log('Scanning for hosts..1.');

    const playerId = `host_${Date.now()}`;
    const hostPlayer = {
      id: playerId,
      name: playerName,
      isReady: true,
      isHost: true,
    };

    hostServer = new HostServer(hostPlayer, gameConfig, (state) => {
      if (state.players) {
        setPlayers(state.players);
        // Update player count in announcer
        if (hostAnnouncer) {
          hostAnnouncer.updatePlayerCount(state.players.length);
        }
      }
      if (state.timeRemaining !== undefined)
        setTimeRemaining(state.timeRemaining);
      if (state.answer) addAnswer(state.answer);
      if (state.gameEnded) {
        setGameState('ended');
        router.push('/result' as any);
      }
    });
    console.log('Scanning for hosts..2.');

    try {
      const address = await hostServer.start(8080);

      setServerAddress(address);
      setPlayers([hostPlayer]);

      // Try to start auto-discovery
      console.log('Scanning for hosts..4.');

      try {
        const localIp = await getLocalIpAddress();
        if (localIp && localIp !== '0.0.0.0') {
          hostAnnouncer = new HostAnnouncer({
            name: `${playerName}'s Game`,
            address: localIp,
            port: 8080,
            playerCount: 1,
          });
          hostAnnouncer.startAnnouncing(8081);
          console.log('✅ Auto-discovery enabled');
        } else {
          Alert.alert(
            'Auto-Discovery Failed',
            'Could not get local IP address. Players will need to manually enter your IP to join.',
          );
        }
      } catch (discoveryError) {
        const errorMessage =
          discoveryError instanceof Error
            ? discoveryError.message
            : String(discoveryError);
        console.error('Auto-discovery error:', errorMessage);
        Alert.alert(
          'Auto-Discovery Unavailable',
          `Auto-discovery could not be started.\n\nReason: ${errorMessage}\n\nYour game is still running! Share your IP address (${serverAddress}) with players so they can join manually.`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Failed to start server:', errorMessage);
      Alert.alert(
        'Server Failed to Start',
        `Could not start the game server.\n\nError: ${errorMessage}\n\nThis is likely due to:\n• Platform limitations\n• Missing network permissions\n• TCP socket not supported on this device\n\nTry:\n1. Restart the app\n2. Check app permissions\n3. Try on a different device`,
      );
    }
  };

  const handleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);

    if (!isHost && clientConnection) {
      clientConnection.send({
        type: 'PLAYER_READY',
        payload: {
          playerId: `player_${Date.now()}`,
          isReady: newReadyState,
        },
      });
    }
  };

  const handleStartGame = async () => {
    if (!isHost || !hostServer) return;

    const allReady = players.every((p) => p.isReady);
    if (!allReady) {
      Alert.alert('Not Ready', 'All players must be ready');
      return;
    }

    setGameState('playing');
    await hostServer.startGame();
    router.push('/game' as any);
  };

  const canStartGame = isHost && players.every((p) => p.isReady);

  return (
    <LinearGradient
      colors={['#7C3AED', '#EC4899', '#EF4444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lobby</Text>
          <Text style={styles.subtitle}>Waiting for players to join...</Text>
        </View>

        {/* Server Address */}
        {isHost && serverAddress && (
          <View style={styles.serverCard}>
            <LinearGradient
              colors={['#F5F3FF', '#FCE7F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.serverCardGradient}
            >
              <Text style={styles.serverLabel}>📡 Server Address</Text>
              <Text style={styles.serverAddress}>{serverAddress}</Text>
              <Text style={styles.serverHint}>
                Share this with other players
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Game Settings */}
        <View style={styles.settingsCard}>
          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>⚙️ Game Settings</Text>
            <View style={styles.settingsRow}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Questions</Text>
                <Text style={styles.settingValue}>
                  {gameConfig.questionsCount}
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Time/Question</Text>
                <Text style={styles.settingValue}>
                  {gameConfig.timePerQuestion}s
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Players Header */}
        <View style={styles.playersHeader}>
          <Text style={styles.playersTitle}>Players</Text>
          <View style={styles.playersBadge}>
            <Text style={styles.playersBadgeText}>{players.length} online</Text>
          </View>
        </View>

        {/* Players List */}
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.playerCard}>
              <View style={styles.playerContent}>
                <View style={styles.playerLeft}>
                  <LinearGradient
                    colors={
                      item.isHost
                        ? ['#FBBF24', '#F59E0B']
                        : ['#60A5FA', '#4F46E5']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playerAvatar}
                  >
                    <Text style={styles.playerEmoji}>
                      {item.isHost ? '👑' : '👤'}
                    </Text>
                  </LinearGradient>
                  <View>
                    <Text style={styles.playerName}>{item.name}</Text>
                    <Text style={styles.playerRole}>
                      {item.isHost ? 'Host' : 'Player'}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.readyBadge,
                    item.isReady
                      ? styles.readyBadgeReady
                      : styles.readyBadgeNotReady,
                  ]}
                >
                  <Text
                    style={[
                      styles.readyBadgeText,
                      item.isReady
                        ? styles.readyBadgeTextReady
                        : styles.readyBadgeTextNotReady,
                    ]}
                  >
                    {item.isReady ? '✓ Ready' : '○ Not Ready'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          style={styles.playersList}
          showsVerticalScrollIndicator={false}
        />

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!isHost && (
            <TouchableOpacity
              onPress={handleReady}
              style={styles.readyButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isReady ? ['#F87171', '#EC4899'] : ['#34D399', '#10B981']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.readyButtonGradient}
              >
                <Text style={styles.readyButtonText}>
                  {isReady ? '✗ Not Ready' : '✓ Ready'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {isHost && (
            <TouchableOpacity
              onPress={handleStartGame}
              disabled={!canStartGame}
              style={[
                styles.startButton,
                !canStartGame && styles.startButtonDisabled,
              ]}
              activeOpacity={0.8}
            >
              {canStartGame ? (
                <LinearGradient
                  colors={['#34D399', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>🚀 Start Game</Text>
                </LinearGradient>
              ) : (
                <View style={styles.startButtonGradient}>
                  <Text style={styles.startButtonTextDisabled}>
                    ⏳ Waiting for players...
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  serverCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  serverCardGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  serverLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  serverAddress: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  serverHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  settingsCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  settingsContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingItem: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  settingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  playersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playersBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  playersBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playersList: {
    flex: 1,
    marginBottom: 16,
  },
  playerCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerEmoji: {
    fontSize: 24,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  playerRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  readyBadge: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  readyBadgeReady: {
    backgroundColor: '#D1FAE5',
  },
  readyBadgeNotReady: {
    backgroundColor: '#FEE2E2',
  },
  readyBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  readyBadgeTextReady: {
    color: '#059669',
  },
  readyBadgeTextNotReady: {
    color: '#DC2626',
  },
  actions: {
    paddingBottom: 32,
  },
  readyButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  readyButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  readyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  startButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  startButtonTextDisabled: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'center',
  },
});

export { hostAnnouncer, hostServer };
