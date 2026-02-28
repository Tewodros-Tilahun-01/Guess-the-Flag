import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';

export default function MainMenu() {
  const router = useRouter();
  const { setGameMode, setGameState, resetGame } = useGameStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
                <Text style={styles.buttonEmoji}>👤</Text>
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
                <Text style={[styles.buttonEmoji, { fontSize: 35 }]}>👥</Text>
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
          <TouchableOpacity
            onPress={() => setShowHowToPlay(true)}
            style={styles.howToPlayButton}
            activeOpacity={0.7}
          >
            <Text style={styles.howToPlayIcon}>❓</Text>
            <Text style={styles.howToPlayText}>How to Play</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>Powered by flagcdn.com</Text>
        </View>
      </View>

      {/* How to Play Modal */}
      <Modal
        visible={showHowToPlay}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHowToPlay(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowHowToPlay(false)}
          />
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB']}
            style={styles.modalContainer}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎮 How to Play</Text>
              <TouchableOpacity
                onPress={() => setShowHowToPlay(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* Single Player Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionEmoji}>👤</Text>
                  <Text style={styles.sectionTitle}>Single Player</Text>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Choose Settings</Text>
                    <Text style={styles.stepText}>
                      Select number of questions (5-20), time per question
                      (10-60s), and difficulty levels
                    </Text>
                  </View>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Guess the Flag</Text>
                    <Text style={styles.stepText}>
                      Type the country name for each flag shown. Answer before
                      time runs out!
                    </Text>
                  </View>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>View Results</Text>
                    <Text style={styles.stepText}>
                      See your score and review all answers at the end
                    </Text>
                  </View>
                </View>
              </View>

              {/* Multiplayer Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionEmoji}>👥</Text>
                  <Text style={styles.sectionTitle}>Multiplayer (LAN)</Text>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Host or Join</Text>
                    <Text style={styles.stepText}>
                      Host: Create a game and share the server address or QR
                      code{'\n'}Join: Enter host's IP address or scan QR code
                    </Text>
                  </View>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Wait in Lobby</Text>
                    <Text style={styles.stepText}>
                      All players must click "Ready". Host starts the game when
                      everyone is ready
                    </Text>
                  </View>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Compete Together</Text>
                    <Text style={styles.stepText}>
                      Answer the same questions at the same time. Answers
                      auto-submit when time ends
                    </Text>
                  </View>
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Compare Scores</Text>
                    <Text style={styles.stepText}>
                      View everyone's results and see who knows flags best!
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tips Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionEmoji}>💡</Text>
                  <Text style={styles.sectionTitle}>Tips</Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipIcon}>⚡</Text>
                  <Text style={styles.tipText}>
                    Type quickly - time is limited!
                  </Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipIcon}>📱</Text>
                  <Text style={styles.tipText}>
                    Host can create a WiFi hotspot and players join it - no
                    internet needed!
                  </Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipIcon}>🌐</Text>
                  <Text style={styles.tipText}>
                    All devices must be on the same WiFi network or hotspot
                  </Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipIcon}>💾</Text>
                  <Text style={styles.tipText}>
                    Uses minimal data - only a few KB per game to load flags
                  </Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipIcon}>🎯</Text>
                  <Text style={styles.tipText}>
                    Spelling must be exact - watch for spaces and hyphens
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowHowToPlay(false)}
              style={styles.gotItButton}
            >
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gotItButtonGradient}
              >
                <Text style={styles.gotItButtonText}>Got it! 🎯</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  howToPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 16,
  },
  howToPlayIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  howToPlayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    height: '85%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  gotItButton: {
    margin: 24,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gotItButtonGradient: {
    paddingVertical: 16,
  },
  gotItButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
