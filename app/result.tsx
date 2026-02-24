import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';
import { getFlagUrlMD } from '../src/utils/flagUrl';

export default function Result() {
  const router = useRouter();
  const navigation = useNavigation();

  const { answers, playerName, resetGame } = useGameStore();

  const playerAnswers = answers.filter((a) => a.playerName === playerName);
  const correctCount = playerAnswers.filter((a) => a.isCorrect).length;
  const totalCount = playerAnswers.length;
  const score =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const handlePlayAgain = () => {
    resetGame();

    router.dismissAll();
    // Replace the current screen with the new one (e.g., the dashboard)
    router.replace('/');
  };

  const getScoreColors = (): [string, string] => {
    if (score >= 80) return ['#34D399', '#10B981'];
    if (score >= 60) return ['#60A5FA', '#06B6D4'];
    if (score >= 40) return ['#FBBF24', '#F59E0B'];
    return ['#F87171', '#EC4899'];
  };

  const getScoreEmoji = () => {
    if (score >= 80) return '🏆';
    if (score >= 60) return '🎉';
    if (score >= 40) return '👍';
    return '💪';
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
        <Text style={styles.title}>Results</Text>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <LinearGradient
            colors={getScoreColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scoreCardGradient}
          >
            <Text style={styles.scoreEmoji}>{getScoreEmoji()}</Text>
            <Text style={styles.scoreValue}>{score}%</Text>
            <Text style={styles.scoreText}>
              {correctCount} / {totalCount} Correct
            </Text>
          </LinearGradient>
        </View>

        {/* Answers List */}
        <View style={styles.answersHeader}>
          <Text style={styles.answersTitle}>Your Answers</Text>
          <View style={styles.answersBadge}>
            <Text style={styles.answersBadgeText}>
              {playerAnswers.length} questions
            </Text>
          </View>
        </View>

        <FlatList
          data={playerAnswers}
          keyExtractor={(item, index) => `${item.questionIndex}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.answerCard}>
              <LinearGradient
                colors={
                  item.isCorrect
                    ? ['#D1FAE5', '#A7F3D0']
                    : ['#FEE2E2', '#FECACA']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.answerCardGradient}
              >
                {/* Flag */}
                <View style={styles.answerFlag}>
                  <Image
                    source={{
                      uri: getFlagUrlMD(item.flagFile.replace('.png', '')),
                    }}
                    style={styles.answerFlagImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Content */}
                <View style={styles.answerContent}>
                  <View style={styles.answerStatus}>
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
                    <Text
                      style={[
                        styles.answerStatusText,
                        item.isCorrect
                          ? styles.answerStatusTextCorrect
                          : styles.answerStatusTextWrong,
                      ]}
                    >
                      {item.isCorrect ? 'Correct' : 'Wrong'}
                    </Text>
                  </View>
                  <Text style={styles.answerCountry}>{item.correctAnswer}</Text>
                  {!item.isCorrect && (
                    <Text style={styles.answerUserAnswer}>
                      You answered: {item.answer || '(no answer)'}
                    </Text>
                  )}
                </View>
              </LinearGradient>
            </View>
          )}
          style={styles.answersList}
          showsVerticalScrollIndicator={false}
        />

        {/* Play Again Button */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handlePlayAgain}
            style={styles.playAgainButton}
            activeOpacity={0.8}
          >
            <View style={styles.playAgainButtonContent}>
              <Text style={styles.playAgainButtonText}>🏠 Back to Menu</Text>
            </View>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreCard: {
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  scoreCardGradient: {
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  scoreEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  answersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  answersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  answersBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  answersBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  answersList: {
    flex: 1,
  },
  answerCard: {
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
  answerCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  answerFlag: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  answerFlagImage: {
    width: 72,
    height: 54,
  },
  answerContent: {
    flex: 1,
  },
  answerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerIcon: {
    fontSize: 24,
  },
  answerIconCorrect: {
    color: '#10B981',
  },
  answerIconWrong: {
    color: '#EF4444',
  },
  answerStatusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerStatusTextCorrect: {
    color: '#047857',
  },
  answerStatusTextWrong: {
    color: '#B91C1C',
  },
  answerCountry: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  answerUserAnswer: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  playAgainButton: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  playAgainButtonContent: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  playAgainButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
  },
});
