import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSchoolContext } from '@/components/SchoolContext';

export default function TimerScreen() {
  const { schoolData } = useSchoolContext();
  const [dayCountdown, setDayCountdown] = useState('');
  const [yearCountdown, setYearCountdown] = useState('');

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [schoolData]);

  const updateCountdown = () => {
    const now = new Date();
    const dayEnd = new Date(now.toDateString() + ' ' + schoolData.dayEnd);
    const yearEnd = new Date(schoolData.yearEnd);

    if (now > dayEnd) {
      setDayCountdown('School day has ended');
    } else {
      const diff = dayEnd.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setDayCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }

    const daysLeft = Math.ceil((yearEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setYearCountdown(`${daysLeft} days`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Timer</Text>
      <Text style={styles.countdown}>Time until school day ends: {dayCountdown}</Text>
      <Text style={styles.countdown}>Days left in school year: {yearCountdown}</Text>
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
  countdown: {
    fontSize: 16,
    marginBottom: 10,
  },
});
