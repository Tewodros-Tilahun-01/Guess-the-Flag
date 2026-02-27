import { getMultiplayerConnection } from '@/src/utils/connectionManager';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';
import { getFlagUrlMD } from '../src/utils/flagUrl';

export default function Result() {
  const router = useRouter();

  const {
    playerAnswers,
    playerName,
    playerId,
    gameMode,
    resetGame,
    resetGameState,
    isHost,
  } = useGameStore();

  useEffect(() => {
    // Send "not ready" status when reaching result page (multiplayer only, non-host)
    if (gameMode === 'multiplayer' && playerId && !isHost) {
      const connection = getMultiplayerConnection();
      if (connection) {
        connection.send({
          type: 'PLAYER_READY',
          payload: {
            playerId: playerId,
            isReady: false,
          },
        });
      }
    }
  }, []);

  // playerAnswers is already an array of { playerId, playerName, answers }
  // Sort by score
  const playersData = playerAnswers.map((player) => {
    const correctCount = player.answers.filter((a) => a.isCorrect).length;
    const totalCount = player.answers.length;
    const score =
      totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    return { ...player, score, correctCount, totalCount };
  });

  playersData.sort((a, b) => b.score - a.score);

  const [selectedPlayer, setSelectedPlayer] = useState(playerName);

  const selectedPlayerData = playersData.find(
    (p) => p.playerName === selectedPlayer,
  );
  const selectedAnswers = selectedPlayerData?.answers || [];

  const handlePlayAgain = () => {
    resetGameState();
    router.back();
  };

  const handleExit = () => {
    router.dismissAll();
    router.replace('/');
    resetGame();
    const connection = getMultiplayerConnection();
    if (connection) {
      connection.disconnect();
    }
  };

  const getStars = (score: number) => {
    if (score >= 90) return '⭐⭐⭐⭐⭐';
    if (score >= 70) return '⭐⭐⭐⭐☆';
    if (score >= 60) return '⭐⭐⭐☆☆';
    if (score >= 50) return '⭐⭐☆☆☆';
    if (score >= 30) return '⭐☆☆☆☆';
    return '☆☆☆☆☆';
  };

  return (
    <LinearGradient
      colors={['#2563EB', '#4F46E5', '#7C3AED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>🏆 Game Results</Text>

        {/* Player Tabs */}
        {gameMode === 'multiplayer' && playersData.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContent}
          >
            {playersData.map((player) => (
              <TouchableOpacity
                key={player.playerId}
                onPress={() => setSelectedPlayer(player.playerName)}
                style={[
                  styles.tab,
                  selectedPlayer === player.playerName && styles.tabActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedPlayer === player.playerName &&
                      styles.tabTextActive,
                  ]}
                >
                  {player.playerName === playerName ? 'You' : player.playerName}
                  : {player.score}%
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Performance Card */}
        <View style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>📊 Your Performance</Text>
          <View style={styles.performanceContent}>
            <Text style={styles.performanceScore}>
              Score: {selectedPlayerData?.score}% •{' '}
              {selectedPlayerData?.correctCount}/
              {selectedPlayerData?.totalCount}
            </Text>
            <Text style={styles.performanceStars}>
              {getStars(selectedPlayerData?.score || 0)}
            </Text>
          </View>
        </View>

        {/* Answers Section */}
        <Text style={styles.answersTitle}>🌍 Your Answers</Text>

        <FlatList
          data={selectedAnswers}
          keyExtractor={(item, index) => `${item.questionIndex}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Image
                  source={{
                    uri: getFlagUrlMD(item.flagFile.replace('.png', '')),
                  }}
                  style={styles.answerFlag}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
                <Text style={styles.answerQuestion}>
                  Q{index + 1}: {item.correctAnswer}
                </Text>
              </View>
              <View style={styles.answerRow}>
                <Text
                  style={[
                    styles.answerIcon,
                    item.isCorrect
                      ? styles.answerIconCorrect
                      : styles.answerIconWrong,
                  ]}
                >
                  {item.isCorrect ? '✓' : '✗'}
                </Text>
                <Text style={styles.answerText}>
                  You wrote: {item.answer || '(no answer)'}
                </Text>
              </View>
            </View>
          )}
          style={styles.answersList}
          showsVerticalScrollIndicator={false}
        />

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handlePlayAgain}
            style={styles.playAgainButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#34D399', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExit}
            style={styles.exitButton}
            activeOpacity={0.8}
          >
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  tabsContainer: {
    marginBottom: 24,
    maxHeight: 60,
  },
  tabsContent: {
    paddingHorizontal: 4,
  },
  tab: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabTextActive: {
    color: '#4F46E5',
  },
  performanceCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  performanceContent: {
    alignItems: 'center',
  },
  performanceScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  performanceStars: {
    fontSize: 24,
  },
  answersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  answersList: {
    flex: 1,
    marginBottom: 16,
  },
  answerCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerFlag: {
    width: 48,
    height: 36,
    borderRadius: 4,
    marginRight: 12,
  },
  answerQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  answerIconCorrect: {
    color: '#10B981',
  },
  answerIconWrong: {
    color: '#EF4444',
  },
  answerText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  actions: {
    paddingBottom: 32,
  },
  playAgainButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  exitButton: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
  },
});
