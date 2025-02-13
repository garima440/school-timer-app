import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  Text,
  Platform,
  KeyboardTypeOptions,
} from 'react-native';
import { useSchoolContext } from '@/components/SchoolContext';
import { Calendar, Clock } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MotiView, MotiText } from 'moti';

// Define TypeScript interfaces
interface NavigationProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

// Theme configuration with proper type
const SPACE_THEME = {
  primary: '#6B4FBB' as const,    
  secondary: '#2D3561' as const,  
  accent: '#916AF6' as const,     
  success: '#50C878' as const,    
  warning: '#FFD700' as const,    
  error: '#FF6B6B' as const,      
  background: ['#1A1B4B', '#2D3561'] as const, // Tuple type for gradient
  text: '#FFFFFF' as const,
  textSecondary: '#B8B8D1' as const,
};

export default function InputScreen({ navigation }: NavigationProps) {
  const { schoolData, setSchoolData } = useSchoolContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [screen, setScreen] = useState<'year' | 'day'>('year');
  const alienAnimation = useRef<LottieView>(null);
  const rocketAnimation = useRef<LottieView>(null);

  const validateDate = (date: string): boolean => {
    const regex = /^\d{4}-([0-1]\d)-([0-3]\d)$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const validateTime = (time: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateDate(schoolData.yearStart)) newErrors.yearStart = 'Enter a valid date (YYYY-MM-DD)';
    if (!validateDate(schoolData.yearEnd)) newErrors.yearEnd = 'Enter a valid date (YYYY-MM-DD)';
    if (!validateTime(schoolData.dayStart)) newErrors.dayStart = 'Enter a valid time (HH:MM)';
    if (!validateTime(schoolData.dayEnd)) newErrors.dayEnd = 'Enter a valid time (HH:MM)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const updateSchoolData = (key: string, value: string) => {
    setSchoolData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const getInputProps = (key: string) => {
    const isDate = key.includes('year');
    return {
      placeholder: isDate ? 'YYYY-MM-DD' : 'HH:MM',
      keyboardType: (Platform.OS === 'ios' ? 'default' : 'numeric') as KeyboardTypeOptions,
      maxLength: isDate ? 10 : 5,
      onFocus: () => setFocusedInput(key),
      onBlur: () => setFocusedInput(null),
    };
  };

  const saveData = async () => {
    if (validateInputs()) {
      setSchoolData({ ...schoolData });
      if (rocketAnimation.current) {
        rocketAnimation.current.play();
      }
      await handlePress();
      setTimeout(() => {
        Alert.alert('Blast Off! 🚀', 'Your space mission is set to begin!');
        navigation.navigate('Timer');
      }, 2000);
    }
  };

  const renderInputGroup = (key: string) => {
    const isDate = key.includes('year');
    const Icon = isDate ? Calendar : Clock;
    const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 300 }}
        style={styles.inputGroup}
      >
        {/* <Text style={styles.label}>
          {isDate ? '🌎 ' : '⏰ '}{label}
        </Text>
         */}
        {/* Wrapper View for shadow */}
        <View style={[
          styles.inputShadowContainer,
          focusedInput === key && styles.inputFocused,
          errors[key] && styles.inputError
        ]}>
          {/* LinearGradient without shadow */}
          <LinearGradient
            colors={[SPACE_THEME.secondary, SPACE_THEME.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
          >
            <Icon size={18} color={SPACE_THEME.text} />
            <TextInput
              {...getInputProps(key)}
              style={[styles.input, { color: SPACE_THEME.text }]}
              value={schoolData[key as keyof typeof schoolData]}
              onChangeText={(text) => updateSchoolData(key, text)}
              placeholderTextColor={SPACE_THEME.textSecondary}
            />
          </LinearGradient>
        </View>
  
        {errors[key] && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <Text style={styles.errorText}>{errors[key]}</Text>
          </MotiView>
        )}
      </MotiView>
    );
  };

  return (
    <LinearGradient colors={SPACE_THEME.background} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
        >
          <View style={styles.content}>
            <MotiText
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.title}
            >
              Space Mission Setup
            </MotiText>
            
            <Text style={styles.subtitle}>
              {screen === 'year' ? 'Plan Your Cosmic Year' : 'Set Your Daily Space Route 🛸'}
            </Text>

            {screen === 'year' ? (
              <>
                <View style={styles.section}>
                  <LottieView
                    autoPlay
                    ref={alienAnimation}
                    style={styles.alienAnimation}
                    source={require('@/assets/animations/hi.json')}
                  />
                  {renderInputGroup('yearStart')}
                  {renderInputGroup('yearEnd')}
                </View>
                <TouchableOpacity 
                  style={styles.nextButton} 
                  onPress={async () => {
                    await handlePress();
                    setScreen('day');
                  }}
                >
                  <Text style={styles.nextButtonText}>Next Mission</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.section}>
                  <LottieView
                    ref={rocketAnimation}
                    style={styles.rocketAnimation}
                    source={require('@/assets/animations/spaceship.json')}
                    loop={false}
                  />
                  {renderInputGroup('dayStart')}
                  {renderInputGroup('dayEnd')}
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={async () => {
                      await handlePress();
                      setScreen('year');
                    }}
                  >
                    <Text style={styles.backButtonText}>← Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={saveData}
                  >
                    <Text style={styles.saveButtonText}>Launch Mission!</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },

  inputShadowContainer: {
    borderRadius: 12,
    shadowColor: SPACE_THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: SPACE_THEME.secondary, // Add background color for shadow
  },

  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    overflow: 'hidden',
  },

  content: { 
    flex: 1, 
    padding: 20 
  },

  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center',
    color: SPACE_THEME.text,
    textShadowColor: SPACE_THEME.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: { 
    fontSize: 18, 
    color: SPACE_THEME.textSecondary, 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  section: { 
    marginBottom: 24 
  },
  inputGroup: { 
    marginBottom: 16 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 8, 
    color: SPACE_THEME.text, 
    textTransform: 'capitalize',
    fontWeight: '600'
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 12,
    paddingHorizontal: 16, 
    height: 56,
    shadowColor: SPACE_THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  inputFocused: {
    borderColor: SPACE_THEME.accent,
    borderWidth: 2,
  },
  
  inputError: {
    borderColor: SPACE_THEME.error,
    borderWidth: 2,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    color: SPACE_THEME.text,
  },
  errorText: { 
    color: SPACE_THEME.error, 
    fontSize: 14, 
    marginTop: 4 
  },
  alienAnimation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: 200
  },
  rocketAnimation: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  nextButton: { 
    backgroundColor: SPACE_THEME.accent,
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 24,
    shadowColor: SPACE_THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  nextButtonText: { 
    color: SPACE_THEME.text, 
    fontSize: 18, 
    fontWeight: '700' 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 24 
  },
  backButton: { 
    backgroundColor: SPACE_THEME.secondary,
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 12,
    shadowColor: SPACE_THEME.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  backButtonText: { 
    color: SPACE_THEME.text, 
    fontSize: 18, 
    fontWeight: '600' 
  },
  saveButton: { 
    backgroundColor: SPACE_THEME.accent,
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 12,
    shadowColor: SPACE_THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  saveButtonText: { 
    color: SPACE_THEME.text, 
    fontSize: 18, 
    fontWeight: '700' 
  },
});