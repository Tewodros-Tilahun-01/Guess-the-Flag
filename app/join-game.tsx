import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClientConnection } from '../src/multiplayer/ClientConnection';
import {
  DiscoveredHost,
  HostDiscoveryService,
} from '../src/multiplayer/HostDiscovery';
import { useGameStore } from '../src/store/gameStore';

let clientConnection: ClientConnection | null = null;

export default function JoinGame() {
  const router = useRouter();
  const {
    setPlayerName,
    setPlayers,
    setGameConfig,
    setCurrentQuestion,
    setTimeRemaining,
    setGameState,
  } = useGameStore();
  const [name, setName] = useState('Player');
  const [connecting, setConnecting] = useState(false);
  const [discoveredHosts, setDiscoveredHosts] = useState<DiscoveredHost[]>([]);
  const [discoveryService] = useState(
    () => new HostDiscoveryService(setDiscoveredHosts),
  );
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  useEffect(() => {
    // Start discovering hosts
    try {
      discoveryService.startDiscovery(8081);
      console.log('Discovery service started');
    } catch (error) {
      console.error('Failed to start discovery:', error);
      setDiscoveryError(
        'Failed to start auto-discovery. Please check your network connection.',
      );
    }

    return () => {
      discoveryService.stopDiscovery();
    };
  }, []);

  const handleJoinHost = async (host: DiscoveredHost) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    await connectToHost(host.address, host.port);
  };

  const connectToHost = async (ip: string, portNum: number) => {
    setConnecting(true);
    const playerId = `player_${Date.now()}`;
    setPlayerName(name);

    clientConnection = new ClientConnection((message) => {
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

    try {
      await clientConnection.connect(ip, portNum, playerId, name);
      discoveryService.stopDiscovery();
      router.push('/lobby' as any);
    } catch (error) {
      Alert.alert('Connection Failed', 'Could not connect to host');
      setConnecting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F59E0B', '#F97316', '#EF4444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Game</Text>
          <Text style={styles.subtitle}>Select a game to join</Text>
        </View>

        {/* Name Input */}
        <View style={styles.nameSection}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Discovery Error */}
        {discoveryError && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{discoveryError}</Text>
          </View>
        )}

        {/* Discovered Hosts List */}
        <View style={styles.hostsSection}>
          <View style={styles.hostsSectionHeader}>
            <Text style={styles.hostsTitle}>
              {discoveredHosts.length > 0
                ? '🔍 Available Games'
                : '🔍 Searching for games...'}
            </Text>
          </View>

          {discoveredHosts.length === 0 && !discoveryError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No games found on your network
              </Text>
              <Text style={styles.emptyStateHint}>
                Make sure you're on the same WiFi network as the host
              </Text>
            </View>
          ) : (
            <FlatList
              data={discoveredHosts}
              keyExtractor={(item) => `${item.address}:${item.port}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleJoinHost(item)}
                  disabled={connecting}
                  style={styles.hostCard}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#FEF3C7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.hostCardGradient}
                  >
                    <View style={styles.hostCardContent}>
                      <View style={styles.hostCardLeft}>
                        <Text style={styles.hostCardEmoji}>🎮</Text>
                        <View>
                          <Text style={styles.hostCardName}>{item.name}</Text>
                          <Text style={styles.hostCardAddress}>
                            {item.address}:{item.port}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.hostCardRight}>
                        <View style={styles.playerCountBadge}>
                          <Text style={styles.playerCountText}>
                            👥 {item.playerCount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              style={styles.hostsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

export { clientConnection };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  header: {
    marginBottom: 24,
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
  nameSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  hostsSection: {
    flex: 1,
  },
  hostsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hostsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  hostsList: {
    flex: 1,
  },
  hostCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  hostCardGradient: {
    padding: 16,
  },
  hostCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hostCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hostCardEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  hostCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  hostCardAddress: {
    fontSize: 12,
    color: '#6B7280',
  },
  hostCardRight: {},
  playerCountBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  playerCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
});
