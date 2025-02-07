import React from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSchoolContext } from '@/components/SchoolContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


// Add other screen names and their param types here
type RootStackParamList = {
  index: undefined;
  two: undefined;
  
};

export default function InputScreen() {
  const { schoolData, setSchoolData } = useSchoolContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const saveData = () => {
    setSchoolData({...schoolData});
    Alert.alert('Success', 'Data saved successfully!');
    navigation.navigate('two');
  };

  const updateSchoolData = (key: string, value: string) => {
    setSchoolData(prev => ({ ...prev, [key]: value }));
  };

  const getPlaceholder = (key: string) => {
    switch(key) {
      case 'yearStart':
      case 'yearEnd':
        return `School ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} (YYYY-MM-DD)`;
      case 'dayStart':
      case 'dayEnd':
        return `School ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} (24-hour format, HH:MM)`;
      default:
        return key;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Timer Setup</Text>
      {['yearStart', 'yearEnd', 'dayStart', 'dayEnd'].map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={getPlaceholder(key)}
          value={schoolData[key as keyof typeof schoolData]}
          onChangeText={(text) => updateSchoolData(key, text)}
          keyboardType={key.includes('year') ? 'numeric' : 'default'}
        />
      ))}
      <Button title="Save" onPress={saveData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
