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

export default function InputScreen() {
  const { schoolData, setSchoolData } = useSchoolContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [screen, setScreen] = useState<'year' | 'day'>('year'); // Tracks which screen is visible
  const animation = useRef<LottieView>(null);

  const validateDate = (date: string) => {
    const regex = /^\d{4}-([0-1]\d)-([0-3]\d)$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const validateTime = (time: string) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!validateDate(schoolData.yearStart)) newErrors.yearStart = 'Enter a valid date (YYYY-MM-DD)';
    if (!validateDate(schoolData.yearEnd)) newErrors.yearEnd = 'Enter a valid date (YYYY-MM-DD)';
    if (!validateTime(schoolData.dayStart)) newErrors.dayStart = 'Enter a valid time (HH:MM)';
    if (!validateTime(schoolData.dayEnd)) newErrors.dayEnd = 'Enter a valid time (HH:MM)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveData = () => {
    if (validateInputs()) {
      setSchoolData({ ...schoolData });
      Alert.alert('Success', 'School timer settings saved successfully!');
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

  const renderInputGroup = (key: string) => {
    const isDate = key.includes('year');
    const Icon = isDate ? Calendar : Clock;
    const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();

    return (
      
      <View key={key} style={styles.inputGroup}>
        
        <Text style={styles.label}>{label}</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === key && styles.inputFocused,
          errors[key] && styles.inputError
        ]}>
          <Icon size={18} color={errors[key] ? '#dc2626' : focusedInput === key ? '#4CAF50' : '#666'} />
          <TextInput
            {...getInputProps(key)}
            style={styles.input}
            value={schoolData[key as keyof typeof schoolData]}
            onChangeText={(text) => updateSchoolData(key, text)}
          />
        </View>
        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>School Timer Setup</Text>
          <Text style={styles.subtitle}>
            {screen === 'year' ? 'Enter your school year details' : 'Enter your daily schedule'}
          </Text>

          {screen === 'year' ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>School Year</Text>
                <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 200,
                  height: 200,
                 
                  
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('@/assets/animations/hi.json')}
              />
                {renderInputGroup('yearStart')}
                {renderInputGroup('yearEnd')}
              </View>
              <TouchableOpacity style={styles.nextButton} onPress={() => setScreen('day')}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Daily Schedule</Text>
                {renderInputGroup('dayStart')}
                {renderInputGroup('dayEnd')}
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => setScreen('year')}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveData}>
                  <Text style={styles.saveButtonText}>Save Schedule</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#444' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, color: '#444', textTransform: 'capitalize' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, height: 48, backgroundColor: '#fff' },
  inputFocused: { borderColor: '#4CAF50', borderWidth: 2 },
  inputError: { borderColor: '#dc2626', borderWidth: 2 },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  nextButton: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  backButton: { backgroundColor: '#ddd', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 8 },
  backButtonText: { color: '#444', fontSize: 16, fontWeight: '600' },
  saveButton: { backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

