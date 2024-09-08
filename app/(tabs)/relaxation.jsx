import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import CustomButton from '../../components/CustomButton'; 

const { width: screenWidth } = Dimensions.get('window');


const defaultBreathingSteps = [
  { instruction: 'Inhale', duration: 4 },
  { instruction: 'Hold', duration: 2 },
  { instruction: 'Exhale', duration: 4 },
  { instruction: 'Hold', duration: 2 },
];

export default function Relaxation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const [sound, setSound] = useState();
  const [duration, setDuration] = useState(60);
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingSteps, setBreathingSteps] = useState(defaultBreathingSteps);
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(breathingSteps[0].duration);
  const fadeAnim = useState(new Animated.Value(1))[0]; 
  const scaleAnim = useState(new Animated.Value(1))[0];


  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/meditation-bell.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };


  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleComplete = () => {
    setIsPlaying(false);
    setKey((prevKey) => prevKey + 1);
    playSound();
  };


  const changeDuration = () => {
    Alert.prompt(
      'Set Timer Duration',
      'Enter the desired duration in seconds:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (input) => {
            const newDuration = parseInt(input, 10);
            if (!isNaN(newDuration) && newDuration > 0) {
              setDuration(newDuration);
              setKey((prevKey) => prevKey + 1);
            } else {
              Alert.alert('Invalid Input', 'Please enter a positive number.');
            }
          },
        },
      ],
      'plain-text',
      `${duration}` 
    );
  };


  const promptForBreathingDurations = () => {
    const updatedSteps = [...breathingSteps]; 

    const promptSequence = (stepIndex = 0) => {
      if (stepIndex >= updatedSteps.length) {
        setBreathingSteps(updatedSteps); 
        setBreathingTimeLeft(updatedSteps[0].duration); 
        return; 
      }

      const currentStep = updatedSteps[stepIndex];

      Alert.prompt(
        `Set ${currentStep.instruction} Duration`,
        `Enter the duration for ${currentStep.instruction} in seconds:`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              
              setBreathingSteps(defaultBreathingSteps);
              setBreathingTimeLeft(defaultBreathingSteps[0].duration);
            },
          },
          {
            text: 'OK',
            onPress: (input) => {
              const newDuration = parseInt(input, 10);
              if (!isNaN(newDuration) && newDuration > 0) {
                updatedSteps[stepIndex].duration = newDuration;
                promptSequence(stepIndex + 1);
              } else {
                Alert.alert('Invalid Input', 'Please enter a positive number.');
              }
            },
          },
        ],
        'plain-text',
        `${currentStep.duration}` 
      );
    };

    promptSequence();
  };

 
  useEffect(() => {
    if (isPlaying) {
      
      const breathingInterval = setInterval(() => {
        setBreathingTimeLeft((prev) => {
          if (prev === 1) {
            setCurrentStep((prevStep) => (prevStep + 1) % breathingSteps.length); // inhale and exhale cycle
            return breathingSteps[(currentStep + 1) % breathingSteps.length].duration;
          }
          return prev - 1;
        });

        
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
 
      
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);

      return () => clearInterval(breathingInterval);
    }
  }, [isPlaying, fadeAnim, scaleAnim, currentStep, breathingSteps]);

  return (
    <SafeAreaView className="flex-1 bg-[#dbeceb] justify-center items-center">
      <Text className="text-xl font-bold text-[#3B3B3B] mb-6 text-center">
        Take a Mindful Break
      </Text>

      <CountdownCircleTimer
        key={key}
        isPlaying={isPlaying}
        duration={duration} 
        colors={['#88BDBC', '#F7B801', '#A30000']}
        colorsTime={[duration * 0.67, duration * 0.33, 0]}
        onComplete={handleComplete}
        size={screenWidth * 0.7}
        strokeWidth={12}
        trailColor="#f3f3f3"
      >
        {({ remainingTime }) => (
          <TouchableOpacity onPress={changeDuration}>
            <Text className="text-2xl text-[#3B3B3B] font-bold">
              {remainingTime} sec
            </Text>
          </TouchableOpacity>
        )}
      </CountdownCircleTimer>

      <TouchableOpacity onPress={promptForBreathingDurations}>
        <Animated.Text
          style={{
            fontSize: 24,
            color: '#3B3B3B',
            fontWeight: 'bold',
            marginTop: 20,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {breathingSteps[currentStep].instruction} - {breathingTimeLeft} sec
        </Animated.Text>
      </TouchableOpacity>

      <CustomButton
        title={isPlaying ? 'Pause' : 'Start Relaxation'}
        handlePress={() => setIsPlaying(!isPlaying)}
        containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 40 }}
      />

      <CustomButton
        title="Reset Timer"
        handlePress={() => {
          setKey((prevKey) => prevKey + 1);
          setIsPlaying(false);
          setCurrentStep(0);
          setBreathingTimeLeft(breathingSteps[0].duration);
        }}
        containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 20 }}
      />
    </SafeAreaView>
  );
}