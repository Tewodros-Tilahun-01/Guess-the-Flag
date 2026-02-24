import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';
import { setMultiplayerConnection } from '../src/utils/connectionManager';
import { generatePlayerId } from '../src/utils/generateId';
import { createMultiplayerConnection } from '../src/utils/multiplayerConnection';

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
  const [manualIp, setManualIp] = useState('10.23.28.205');
  const [manualPort, setManualPort] = useState('8080');

  const handleManualConnect = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!manualIp.trim()) {
      Alert.alert('Error', 'Please enter the host IP address');
      return;
    }

    const portNum = parseInt(manualPort, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      Alert.alert('Error', 'Please enter a valid port number (1-65535)');
      return;
    }

    await connectToHost(manualIp.trim(), portNum);
  };

  const connectToHost = async (ip: string, portNum: number) => {
    setConnecting(true);

    // Generate unique player ID
    const playerId = generatePlayerId();

    setPlayerName(name);

    // Store the player ID in the game store
    useGameStore.setState({ playerId });

    // Use shared connection utility
    const connection = createMultiplayerConnection(
      router,
      setPlayers,
      setGameConfig,
      setGameState,
      setCurrentQuestion,
      setTimeRemaining,
      useGameStore.getState().setPlayerLeftNotification,
    );

    try {
      await connection.connect(ip, portNum, playerId, name);
      // Set global connection reference for game screen
      setMultiplayerConnection(connection);
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

        {/* Manual IP Entry */}
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>🔗 Connect Manually</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Host IP Address</Text>
            <TextInput
              value={manualIp}
              onChangeText={setManualIp}
              style={styles.input}
              placeholder="e.g., 192.168.1.100"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Port</Text>
            <TextInput
              value={manualPort}
              onChangeText={setManualPort}
              style={styles.input}
              placeholder="8080"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={handleManualConnect}
            disabled={connecting}
            style={styles.connectButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                connecting ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.connectButtonGradient}
            >
              <Text style={styles.connectButtonText}>
                {connecting ? '⏳ Connecting...' : '🚀 Connect to Game'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* COMMENTED OUT FOR TESTING - Auto-discovery section */}
        {/*
        {/* Discovery Error */}
        {/*
        {discoveryError && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{discoveryError}</Text>
          </View>
        )}
        */}

        {/* Discovered Hosts List */}
        {/*
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
        */}
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
  manualSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  connectButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  connectButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  connectButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
