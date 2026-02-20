import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameStore } from '../src/store/gameStore';

export default function MultiplayerMenu() {
  const router = useRouter();
  const { setIsHost } = useGameStore();

  // Check if running in Expo Go (which doesn't support TCP sockets)
  const isExpoGo = Constants.appOwnership === 'expo';

  const handleHost = () => {
    if (isExpoGo) {
      alert(
        'Multiplayer requires a development build.\n\nExpo Go does not support TCP sockets.\n\nRun: npx expo run:android',
      );
      return;
    }
    setIsHost(true);
    router.push('/host-setup' as any);
  };

  const handleJoin = () => {
    if (isExpoGo) {
      alert(
        'Multiplayer requires a development build.\n\nExpo Go does not support TCP sockets.\n\nRun: npx expo run:android',
      );
      return;
    }
    setIsHost(false);
    router.push('/join-game' as any);
  };

  return (
    <LinearGradient
      colors={['#059669', '#10B981', '#14B8A6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌐</Text>
          <Text style={styles.title}>Multiplayer Mode</Text>
          <Text style={styles.subtitle}>
            Play with friends on local network
          </Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          <TouchableOpacity
            onPress={handleHost}
            style={styles.hostButton}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonHeader}>
                <Text style={styles.buttonEmoji}>👑</Text>
                <View style={styles.hostBadge}>
                  <Text style={styles.hostBadgeText}>HOST</Text>
                </View>
              </View>
              <Text style={styles.hostButtonTitle}>Host Game</Text>
              <Text style={styles.hostButtonSubtitle}>
                Create a game and invite others
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleJoin}
            style={styles.joinButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FBBF24', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonContent}
            >
              <View style={styles.buttonHeader}>
                <Text style={styles.buttonEmoji}>🎯</Text>
                <View style={styles.joinBadge}>
                  <Text style={styles.joinBadgeText}>JOIN</Text>
                </View>
              </View>
              <Text style={styles.joinButtonTitle}>Join Game</Text>
              <Text style={styles.joinButtonSubtitle}>
                Connect to an existing game
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 8,
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
    textAlign: 'center',
  },
  options: {
    width: '100%',
    maxWidth: 448,
    gap: 16,
  },
  hostButton: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  buttonContent: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  buttonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonEmoji: {
    fontSize: 32,
  },
  hostBadge: {
    borderRadius: 999,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  hostBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  joinBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  joinBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hostButtonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  hostButtonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  joinButtonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  joinButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  backButton: {
    position: 'absolute',
    bottom: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
