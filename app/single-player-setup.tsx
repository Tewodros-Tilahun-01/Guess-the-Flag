import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';

export default function SinglePlayerSetup() {
  const router = useRouter();
  const {
    setGameConfig,
    setPlayerName,
    setGameMode,
    gameConfig,
    resetGameState,
  } = useGameStore();
  const [name, setName] = useState('Player 1');
  const [questionsCount, setQuestionsCount] = useState(
    gameConfig.questionsCount,
  );
  const [timePerQuestion, setTimePerQuestion] = useState(
    gameConfig.timePerQuestion,
  );
  const [difficultyLevels, setDifficultyLevels] = useState<number[]>(
    gameConfig.difficultyLevels || [1, 2, 3, 4, 5],
  ); // Use gameStore values or default to all

  const toggleDifficulty = (level: number) => {
    if (difficultyLevels.includes(level)) {
      // Don't allow deselecting if it's the last one
      if (difficultyLevels.length === 1) {
        return; // Silently ignore
      }
      setDifficultyLevels(difficultyLevels.filter((l) => l !== level));
    } else {
      setDifficultyLevels([...difficultyLevels, level].sort());
    }
  };

  const handleStart = () => {
    setPlayerName(name);
    setGameMode('single');
    setGameConfig({
      questionsCount: questionsCount,
      timePerQuestion: timePerQuestion,
      difficultyLevels: difficultyLevels,
    });
    resetGameState();
    router.push('/game' as any);
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
        <View style={styles.header}>
          <Text style={styles.title}>Single Player</Text>
          <Text style={styles.subtitle}>Configure your game settings</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Questions Count */}
          <View style={styles.section}>
            <Text style={styles.label}>Number of Questions</Text>
            <View style={styles.optionsRow}>
              {[1, 10, 15, 20].map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => setQuestionsCount(count)}
                  style={[
                    styles.option,
                    questionsCount === count && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      questionsCount === count && styles.optionTextSelected,
                    ]}
                  >
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Per Question */}
          <View style={styles.section}>
            <Text style={styles.label}>Time per Question (seconds)</Text>
            <View style={styles.optionsRow}>
              {[15, 30, 45, 60].map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setTimePerQuestion(time)}
                  style={[
                    styles.option,
                    timePerQuestion === time && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      timePerQuestion === time && styles.optionTextSelected,
                    ]}
                  >
                    {time}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty Levels */}
          <View style={styles.section}>
            <Text style={styles.label}>Difficulty Levels</Text>
            <Text style={styles.hint}>
              Select which difficulty levels to include
            </Text>
            <View style={styles.difficultyGrid}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => toggleDifficulty(level)}
                  style={[
                    styles.difficultyOption,
                    difficultyLevels.includes(level) &&
                      styles.difficultyOptionSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.difficultyNumber,
                      difficultyLevels.includes(level) &&
                        styles.difficultyNumberSelected,
                    ]}
                  >
                    {level}
                  </Text>
                  <Text
                    style={[
                      styles.difficultyLabel,
                      difficultyLevels.includes(level) &&
                        styles.difficultyLabelSelected,
                    ]}
                  >
                    {level === 1
                      ? 'Easy'
                      : level === 2
                        ? 'Medium'
                        : level === 3
                          ? 'Hard'
                          : level === 4
                            ? 'Expert'
                            : 'Master'}
                  </Text>
                  {difficultyLevels.includes(level) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleStart}
            style={styles.startButton}
            activeOpacity={0.8}
          >
            <View style={styles.startButtonContent}>
              <Text style={styles.startButtonText}>Start Game 🚀</Text>
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
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  header: {
    marginBottom: 48,
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
  form: {
    gap: 24,
  },
  section: {
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
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#4F46E5',
  },
  hint: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    marginTop: -4,
  },
  difficultyGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
  },
  difficultyOptionSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  difficultyNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  difficultyNumberSelected: {
    color: '#4F46E5',
  },
  difficultyLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  difficultyLabelSelected: {
    color: '#3730A3',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 12,
    color: '#4F46E5',
  },
  actions: {
    marginTop: 'auto',
    paddingBottom: 32,
  },
  startButton: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonContent: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
  },
});
