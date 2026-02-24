import { getMultiplayerConnection } from '@/src/utils/connectionManager';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GameEngine } from '../src/engine/GameEngine';
import { useGameStore } from '../src/store/gameStore';
import { getFlagUrlHD } from '../src/utils/flagUrl';

const gameEngine = new GameEngine();

export default function Game() {
  const router = useRouter();
  const {
    gameMode,
    playerId,
    playerName,
    gameConfig,
    currentQuestion,
    currentQuestionIndex,
    timeRemaining,
    setCurrentQuestion,
    setCurrentQuestionIndex,
    setTimeRemaining,
    addAnswer,
    setGameState,
  } = useGameStore();

  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  useEffect(() => {
    if (gameMode === 'single') {
      startSinglePlayerGame();
    }
  }, []);

  useEffect(() => {
    if (gameMode === 'single' && currentQuestion) {
      startTimer();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentQuestion]);

  const startSinglePlayerGame = async () => {
    await gameEngine.generateQuestions(gameConfig.questionsCount);
    const question = gameEngine.getCurrentQuestion();
    if (question) {
      setCurrentQuestion(question);
      setCurrentQuestionIndex(0);
      setTimeRemaining(gameConfig.timePerQuestion);
    }
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);

    let time = gameConfig.timePerQuestion;
    setTimeRemaining(time);

    const interval = setInterval(() => {
      time--;
      setTimeRemaining(time);

      if (time <= 0) {
        clearInterval(interval);
        handleNextQuestion();
      }
    }, 1000);

    setTimer(interval);
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const answerObj = gameEngine.createAnswer(
      currentQuestion.questionIndex,
      'single_player',
      playerName,
      answer,
      currentQuestion.country.name,
      currentQuestion.country.flag_file,
    );

    addAnswer(answerObj);

    // Send answer to server in multiplayer mode
    const connection = getMultiplayerConnection();
    if (gameMode === 'multiplayer' && connection && playerId) {
      console.log(
        'Submitting answer - Player ID:',
        playerId,
        'Answer:',
        answer,
      );
      connection.send({
        type: 'SUBMIT_ANSWER',
        payload: {
          playerId: playerId,
          playerName,
          answer,
        },
      });
    }

    if (gameMode === 'single') {
      handleNextQuestion();
    }

    setAnswer('');
  };

  const handleNextQuestion = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    if (gameMode === 'single') {
      const nextQuestion = gameEngine.nextQuestion();

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setCurrentQuestionIndex(nextQuestion.questionIndex);
        setTimeRemaining(gameConfig.timePerQuestion);
      } else {
        setGameState('ended');
        router.push('/result' as any);
      }
    }
    // In multiplayer, the server handles next question automatically
  };

  if (!currentQuestion) {
    return (
      <LinearGradient
        colors={['#2563EB', '#4F46E5', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#2563EB', '#4F46E5', '#7C3AED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>
              {currentQuestionIndex + 1} / {gameConfig.questionsCount}
            </Text>
          </View>
          <View style={styles.timerBadge}>
            <Text
              style={[
                styles.timerText,
                timeRemaining > 10
                  ? styles.timerGreen
                  : timeRemaining > 5
                    ? styles.timerYellow
                    : styles.timerRed,
              ]}
            >
              {timeRemaining}s
            </Text>
          </View>
        </View>

        {/* Flag Card */}
        <View style={styles.flagCard}>
          <LinearGradient
            colors={['#EEF2FF', '#F5F3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.flagCardHeader}
          >
            <Text style={styles.flagCardTitle}>Which country is this?</Text>
          </LinearGradient>
          <View style={styles.flagCardBody}>
            <View style={styles.flagImageContainer}>
              <Image
                source={{
                  uri: getFlagUrlHD(
                    currentQuestion.country.flag_file.replace('.png', ''),
                  ),
                }}
                style={styles.flagImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type country name..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#34D399', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Submit Answer ✓</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  questionBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  questionBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timerBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerGreen: {
    color: '#34D399',
  },
  timerYellow: {
    color: '#FBBF24',
  },
  timerRed: {
    color: '#F87171',
  },
  flagCard: {
    marginBottom: 32,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  flagCardHeader: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  flagCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  flagCardBody: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  flagImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  flagImage: {
    width: 280,
    height: 210,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
