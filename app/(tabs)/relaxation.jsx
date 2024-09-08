import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import CustomButton from '../../components/CustomButton'; // Make sure the path is correct

const { width: screenWidth } = Dimensions.get('window');

// Default breathing steps with initial durations
const defaultBreathingSteps = [
  { instruction: 'Inhale', duration: 4 },
  { instruction: 'Hold', duration: 2 },
  { instruction: 'Exhale', duration: 4 },
  { instruction: 'Hold', duration: 2 }, // Additional Hold step
];

export default function Relaxation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the timer
  const [sound, setSound] = useState();
  const [duration, setDuration] = useState(60); // State for timer duration
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingSteps, setBreathingSteps] = useState(defaultBreathingSteps);
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(breathingSteps[0].duration);
  const fadeAnim = useState(new Animated.Value(1))[0]; // Animation for inhale-exhale
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animation for pulse effect

  // Function to play a sound when the timer starts
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/meditation-bell.mp3') // Ensure you have this sound file in the assets folder
    );
    setSound(sound);
    await sound.playAsync();
  };

  // Cleanup sound when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Function to handle timer completion
  const handleComplete = () => {
    setIsPlaying(false);
    setKey((prevKey) => prevKey + 1); // Reset the timer
    playSound();
  };

  // Function to change the main timer duration
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
              setKey((prevKey) => prevKey + 1); // Reset the timer with new duration
            } else {
              Alert.alert('Invalid Input', 'Please enter a positive number.');
            }
          },
        },
      ],
      'plain-text',
      `${duration}` // Default value as the current duration
    );
  };

  // Function to prompt for durations of all breathing steps
  const promptForBreathingDurations = () => {
    const updatedSteps = [...breathingSteps]; // Copy the steps to update durations

    const promptSequence = (stepIndex = 0) => {
      if (stepIndex >= updatedSteps.length) {
        setBreathingSteps(updatedSteps); // Update breathing steps after all prompts
        setBreathingTimeLeft(updatedSteps[0].duration); // Set the initial time left to the first step's duration
        return; // End sequence
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
              // Reset to default durations if the sequence is canceled
              setBreathingSteps(defaultBreathingSteps);
              setBreathingTimeLeft(defaultBreathingSteps[0].duration);
            },
          },
          {
            text: 'OK',
            onPress: (input) => {
              const newDuration = parseInt(input, 10);
              if (!isNaN(newDuration) && newDuration > 0) {
                updatedSteps[stepIndex].duration = newDuration; // Update the step's duration
                promptSequence(stepIndex + 1); // Move to the next step
              } else {
                Alert.alert('Invalid Input', 'Please enter a positive number.');
              }
            },
          },
        ],
        'plain-text',
        `${currentStep.duration}` // Default value as the current step's duration
      );
    };

    promptSequence(); // Start the sequence
  };

  // Breathing animation logic
  useEffect(() => {
    if (isPlaying) {
      // Handle the countdown for the current breathing step
      const breathingInterval = setInterval(() => {
        setBreathingTimeLeft((prev) => {
          if (prev === 1) {
            // Move to the next step in the breathing cycle
            setCurrentStep((prevStep) => (prevStep + 1) % breathingSteps.length);
            return breathingSteps[(currentStep + 1) % breathingSteps.length].duration;
          }
          return prev - 1;
        });

        // Fade in and out animation for the inhale/hold/exhale text
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

        // Add a pulse effect for breathing instructions
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
        duration={duration} // Use the duration state
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
            transform: [{ scale: scaleAnim }], // Apply the pulse animation
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