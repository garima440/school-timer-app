// In index.tsx
import React, { useState } from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';
import { Text, View } from '@/components/Themed';

import { useSchoolContext } from '@/components/SchoolContext';

export default function InputScreen() {
  const { schoolData, setSchoolData } = useSchoolContext();

  const saveData = () => {
    // Data is already saved in context, so we just need to show a confirmation
    alert('Data saved successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Timer Setup</Text>
      <TextInput
        style={styles.input}
        placeholder="School Year Start (YYYY-MM-DD)"
        value={schoolData.yearStart}
        onChangeText={(text) => setSchoolData(prev => ({ ...prev, yearStart: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="School Year End (YYYY-MM-DD)"
        value={schoolData.yearEnd}
        onChangeText={(text) => setSchoolData(prev => ({ ...prev, yearEnd: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="School Day Start (HH:MM)"
        value={schoolData.dayStart}
        onChangeText={(text) => setSchoolData(prev => ({ ...prev, dayStart: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="School Day End (HH:MM)"
        value={schoolData.dayEnd}
        onChangeText={(text) => setSchoolData(prev => ({ ...prev, dayEnd: text }))}
      />
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
