import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameStore } from '../src/store/gameStore';

export default function MainMenu() {
  const router = useRouter();
  const { setGameMode, setGameState, resetGame } = useGameStore();

  useEffect(() => {
    resetGame();
  }, []);

  const handleSinglePlayer = () => {
    setGameMode('single');
    setGameState('lobby');
    router.push('/single-player-setup' as any);
  };

  const handleMultiplayer = () => {
    setGameMode('multiplayer');
    router.push('/multiplayer-menu' as any);
  };

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌍</Text>
          <Text style={styles.title}>Guess the Flag</Text>
          <Text style={styles.subtitle}>Test your geography knowledge</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleSinglePlayer}
            style={styles.button}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonHeader}>
                <Text style={styles.buttonEmoji}>🎮</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>SOLO</Text>
                </View>
              </View>
              <Text style={styles.buttonTitle}>Single Player</Text>
              <Text style={styles.buttonSubtitle}>
                Play offline at your own pace
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMultiplayer}
            style={[styles.button, styles.buttonSpacing]}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#34D399', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonContent}
            >
              <View style={styles.buttonHeader}>
                <Text style={styles.buttonEmoji}>👥</Text>
                <View style={styles.badgeLight}>
                  <Text style={styles.badgeTextLight}>LAN</Text>
                </View>
              </View>
              <Text style={styles.buttonTitleLight}>Multiplayer</Text>
              <Text style={styles.buttonSubtitleLight}>
                Challenge friends on local network
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by flagcdn.com</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 384,
  },
  button: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  buttonSpacing: {
    marginTop: 16,
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
  badge: {
    backgroundColor: '#E0E7FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  badgeLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeTextLight: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonTitleLight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonSubtitleLight: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
