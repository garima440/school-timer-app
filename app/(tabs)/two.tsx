import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, View as RNView, Easing } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSchoolContext } from '@/components/SchoolContext';

export default function TimerScreen() {
  const { schoolData } = useSchoolContext();
  const [startCountdown, setStartCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [endCountdown, setEndCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [daysLeft, setDaysLeft] = useState(0);
  const [schoolStarted, setSchoolStarted] = useState(false);
  const [schoolEnded, setSchoolEnded] = useState(false);

  // Animation values
  const startAnimation = useRef(new Animated.Value(0)).current;
  const endAnimation = useRef(new Animated.Value(0)).current;
  const daysAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!schoolData.yearStart || !schoolData.yearEnd || !schoolData.dayStart || !schoolData.dayEnd) {
      return;
    }
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [schoolData]);

  // Animation effect
  useEffect(() => {
    const startLoop = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(startAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(startAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    };

    const endLoop = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(endAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(endAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    };

    startLoop();
    endLoop();
  }, []);

  const updateCountdown = () => {
    const now = new Date();
  
    // Check if schoolData is initialized properly
    if (!schoolData.yearStart || !schoolData.yearEnd || !schoolData.dayStart || !schoolData.dayEnd) {
      return;
    }
  
    // Parse times safely
    const [startHours, startMinutes] = schoolData.dayStart.split(":").map(Number);
    const [endHours, endMinutes] = schoolData.dayEnd.split(":").map(Number);
  
    if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
      return;
    }
  
    const dayStart = new Date();
    const dayEnd = new Date();
    dayStart.setHours(startHours, startMinutes, 0, 0);
    dayEnd.setHours(endHours, endMinutes, 0, 0);
  
    // Ensure valid dates for the school year
    const yearStart = new Date(schoolData.yearStart);
    const yearEnd = new Date(schoolData.yearEnd);
  
    if (isNaN(yearStart.getTime()) || isNaN(yearEnd.getTime())) {
      return;
    }
  
    // Calculate school year days
    const totalDays = Math.ceil((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((yearEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const progress = totalDays > 0 ? (totalDays - remainingDays) / totalDays : 0;
  
    // Update progress animation
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  
    setDaysLeft(remainingDays > 0 ? remainingDays : 0);
  
    // Calculate start time countdown
    if (now < dayStart) {
      const diffStart = dayStart.getTime() - now.getTime();
      setStartCountdown({
        hours: Math.floor(diffStart / (1000 * 60 * 60)),
        minutes: Math.floor((diffStart % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diffStart % (1000 * 60)) / 1000),
      });
      setSchoolStarted(false);
    } else {
      setSchoolStarted(true);
    }
  
    // Calculate end time countdown
    if (now > dayEnd) {
      setSchoolEnded(true);
    } else {
      const diffEnd = dayEnd.getTime() - now.getTime();
      setEndCountdown({
        hours: Math.floor(diffEnd / (1000 * 60 * 60)),
        minutes: Math.floor((diffEnd % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diffEnd % (1000 * 60)) / 1000),
      });
      setSchoolEnded(false);
    }
  };

  const AnimatedNumber: React.FC<{ number: number; animation: Animated.Value }> = ({ number, animation }) => {
    const scale = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1],
    });

    return (
      <Animated.Text
        style={[
          styles.number,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {String(number).padStart(2, '0')}
      </Animated.Text>
    );
  };

  const width = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Timer</Text>
      <Text style={styles.subtitle}>School hours: {schoolData.dayStart} - {schoolData.dayEnd}</Text>
      
      {/* School Year Progress */}
      <RNView style={styles.yearContainer}>
        <Text style={styles.timerLabel}>School Year Progress</Text>
        <RNView style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width }]} />
        </RNView>
        <Animated.Text 
          style={[
            styles.daysText,
            {
              transform: [
                {
                  scale: daysAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.1, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {daysLeft} days left
        </Animated.Text>
      </RNView>

      {/* Daily Timers */}
      <RNView style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time until school starts:</Text>
        {!schoolStarted ? (
          <RNView style={styles.countdownContainer}>
            <AnimatedNumber number={startCountdown.hours} animation={startAnimation} />
            <Text style={styles.separator}>:</Text>
            <AnimatedNumber number={startCountdown.minutes} animation={startAnimation} />
            <Text style={styles.separator}>:</Text>
            <AnimatedNumber number={startCountdown.seconds} animation={startAnimation} />
          </RNView>
        ) : (
          <Text style={styles.statusText}>School day has started</Text>
        )}
      </RNView>

      <RNView style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time until school ends:</Text>
        {!schoolEnded ? (
          <RNView style={styles.countdownContainer}>
            <AnimatedNumber number={endCountdown.hours} animation={endAnimation} />
            <Text style={styles.separator}>:</Text>
            <AnimatedNumber number={endCountdown.minutes} animation={endAnimation} />
            <Text style={styles.separator}>:</Text>
            <AnimatedNumber number={endCountdown.seconds} animation={endAnimation} />
          </RNView>
        ) : (
          <Text style={styles.statusText}>School day has ended</Text>
        )}
      </RNView>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  yearContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  daysText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    fontSize: 36,
    fontWeight: 'bold',
    width: 60,
    textAlign: 'center',
  },
  separator: {
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});