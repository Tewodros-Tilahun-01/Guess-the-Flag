import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';

export default function SinglePlayerSetup() {
  const router = useRouter();
  const { setGameConfig, setPlayerName } = useGameStore();
  const [name, setName] = useState('Player 1');
  const [questionsCount, setQuestionsCount] = useState('10');
  const [timePerQuestion, setTimePerQuestion] = useState('30');

  const handleStart = () => {
    setPlayerName(name);
    setGameConfig({
      questionsCount: parseInt(questionsCount) || 10,
      timePerQuestion: parseInt(timePerQuestion) || 30,
    });
    router.push('/game' as any);
  };

  return (
    <LinearGradient
      colors={['#2563EB', '#4F46E5', '#7C3AED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Setup Game</Text>
          <Text style={styles.subtitle}>Configure your game settings</Text>
        </View>

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
            {['5', '10', '15', '20'].map((count) => (
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
            {['15', '30', '45', '60'].map((time) => (
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

        {/* Start Button */}
        <TouchableOpacity
          onPress={handleStart}
          style={styles.startButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#34D399', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Start Game 🚀</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 64,
    paddingBottom: 32,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  startButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
});
