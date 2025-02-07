import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  KeyboardTypeOptions
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSchoolContext } from '@/components/SchoolContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, Clock } from 'lucide-react-native';

type RootStackParamList = {
  index: undefined;
  two: undefined;
};

export default function InputScreen() {
  const { schoolData, setSchoolData } = useSchoolContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

    if (!validateDate(schoolData.yearStart)) {
      newErrors.yearStart = 'Please enter a valid date (YYYY-MM-DD)';
    }
    if (!validateDate(schoolData.yearEnd)) {
      newErrors.yearEnd = 'Please enter a valid date (YYYY-MM-DD)';
    }
    if (!validateTime(schoolData.dayStart)) {
      newErrors.dayStart = 'Please enter a valid time (HH:MM)';
    }
    if (!validateTime(schoolData.dayEnd)) {
      newErrors.dayEnd = 'Please enter a valid time (HH:MM)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveData = () => {
    if (validateInputs()) {
      setSchoolData({...schoolData});
      Alert.alert(
        'Success', 
        'School timer settings saved successfully!',
        [{ text: 'View Timer', onPress: () => navigation.navigate('two') }]
      );
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
    const isTime = key.includes('day');
    
    return {
      placeholder: isDate ? 'YYYY-MM-DD' : 'HH:MM',
      keyboardType: (Platform.OS === 'ios' ? 'default' : 'numeric') as KeyboardTypeOptions, // Explicitly cast
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
          <Icon 
            size={18} 
            color={errors[key] ? '#dc2626' : focusedInput === key ? '#4CAF50' : '#666'} 
          />
          <TextInput
            {...getInputProps(key)}
            style={styles.input}
            value={schoolData[key as keyof typeof schoolData]}
            onChangeText={(text) => updateSchoolData(key, text)}
          />
        </View>
        {errors[key] && (
          <Text style={styles.errorText}>{errors[key]}</Text>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>School Timer Setup</Text>
          <Text style={styles.subtitle}>Enter your school schedule details</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>School Year</Text>
            {renderInputGroup('yearStart')}
            {renderInputGroup('yearEnd')}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Schedule</Text>
            {renderInputGroup('dayStart')}
            {renderInputGroup('dayEnd')}
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveData}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Schedule</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#444',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
    textTransform: 'capitalize',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});