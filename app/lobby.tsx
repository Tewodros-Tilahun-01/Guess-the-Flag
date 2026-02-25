import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ClientConnection } from '../src/multiplayer/ClientConnection';
import { HostServer } from '../src/multiplayer/HostServer';
import { useGameStore } from '../src/store/gameStore';
import {
  getMultiplayerConnection,
  setMultiplayerConnection,
} from '../src/utils/connectionManager';
import { createMultiplayerConnection } from '../src/utils/multiplayerConnection';
import { getLocalIpAddress } from '../src/utils/network';

let hostServer: HostServer | null = null;

export default function Lobby() {
  const router = useRouter();
  const {
    isHost,
    playerName,
    playerId,
    players,
    gameConfig,
    setPlayers,
    setGameState,
    setCurrentQuestion,
    setGameConfig,
    setTimeRemaining,
    resetGameState,
  } = useGameStore();
  const [isReady, setIsReady] = useState(false);
  const [serverAddress, setServerAddress] = useState('');
  const [connection, setConnection] = useState<ClientConnection | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (isHost) {
      initializeHost();
    } else {
      setConnection(getMultiplayerConnection());
    }

    return () => {
      if (isHost && hostServer) {
        // hostServer.stop() is async, handle it properly
        hostServer
          .stop()
          .then(() => {
            hostServer = null;
            resetGameState();
          })
          .catch((error) => {
            hostServer = null;
            resetGameState();
          });
      } else {
        resetGameState();
      }

      if (connection) {
        connection.disconnect();
      }
    };
  }, []);

  const initializeHost = async () => {
    try {
      // Start server (no host player needed!)
      hostServer = new HostServer(gameConfig);
      const address = await hostServer.start(8080);

      // Get local IP
      const localIp = await getLocalIpAddress();
      console.log('Local IP retrieved:', localIp);

      if (localIp && localIp !== '0.0.0.0') {
        setServerAddress(`${localIp}:8080`);

        // Connect as client to own server
        await connectToServer('127.0.0.1', 8080);
      } else {
        setServerAddress(address);
        Alert.alert('Warning', 'Could not get local IP.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Failed to start host:', errorMessage);

      if (errorMessage.includes('EADDRINUSE')) {
        Alert.alert('Port Already In Use', 'Please restart the app.');
      } else {
        Alert.alert('Server Failed to Start', errorMessage);
      }
    }
  };

  const connectToServer = async (ip: string, port: number) => {
    // Use shared connection utility (same code as join-game!)
    const newConnection = createMultiplayerConnection(
      router,
      setPlayers,
      setGameConfig,
      setGameState,
      setCurrentQuestion,
      setTimeRemaining,
      useGameStore.getState().setPlayerLeftNotification,
    );

    await newConnection.connect(ip, port, playerId, playerName);
    setConnection(newConnection);
    setMultiplayerConnection(newConnection);
    setConnection(getMultiplayerConnection());
  };

  const handleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);

    if (connection && playerId) {
      console.log(
        'Sending ready status:',
        newReadyState,
        'Player ID:',
        playerId,
      );
      connection.send({
        type: 'PLAYER_READY',
        payload: {
          playerId: playerId,
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
  };

  const canStartGame = isHost && players.every((p) => p.isReady);

  const getQRData = () => {
    if (!serverAddress) return '';
    const [ip, port] = serverAddress.split(':');
    return JSON.stringify({
      ip,
      port: port || '8080',
      gameName: `${playerName}'s Game`,
    });
  };

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

        {/* Server Address with QR Code */}
        {isHost && serverAddress && (
          <View style={styles.serverCard}>
            <LinearGradient
              colors={['#F5F3FF', '#FCE7F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.serverCardGradient}
            >
              <View style={styles.serverHeader}>
                <View style={styles.serverInfo}>
                  <Text style={styles.serverLabel}>📡 Server Address</Text>
                  <Text style={styles.serverAddress}>{serverAddress}</Text>
                  <Text style={styles.serverHint}>
                    Share this with other players
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowQRCode(true)}
                  style={styles.qrButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qrButtonText}>📱 Show QR</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* QR Code Modal */}
        <Modal
          visible={showQRCode}
          transparent
          animationType="fade"
          onRequestClose={() => setShowQRCode(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowQRCode(false)}
          >
            <View style={styles.qrModal}>
              <LinearGradient
                colors={['#FFFFFF', '#F9FAFB']}
                style={styles.qrModalContent}
              >
                <Text style={styles.qrModalTitle}>Scan to Join</Text>
                <Text style={styles.qrModalSubtitle}>
                  Players can scan this QR code to join
                </Text>
                <View style={styles.qrCodeContainer}>
                  <QRCode value={getQRData()} size={220} />
                </View>
                <Text style={styles.qrModalAddress}>{serverAddress}</Text>
                <TouchableOpacity
                  onPress={() => setShowQRCode(false)}
                  style={styles.qrCloseButton}
                >
                  <Text style={styles.qrCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </Modal>

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
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serverInfo: {
    flex: 1,
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
  qrButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12,
  },
  qrButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModal: {
    width: '85%',
    maxWidth: 350,
  },
  qrModalContent: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  qrModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  qrModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrModalAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 20,
  },
  qrCloseButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  qrCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
