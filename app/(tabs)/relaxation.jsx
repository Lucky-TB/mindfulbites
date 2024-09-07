import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import CustomButton from '../../components/CustomButton'; // Make sure the path is correct

const { width: screenWidth } = Dimensions.get('window');

export default function Relaxation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the timer
  const [sound, setSound] = useState();
  const [duration, setDuration] = useState(60); // State for timer duration

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

  // Function to change the timer duration
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
      >
        {({ remainingTime }) => (
          <TouchableOpacity onPress={changeDuration}>
            <Text className="text-2xl text-[#3B3B3B] font-bold">
              {remainingTime} sec
            </Text>
          </TouchableOpacity>
        )}
      </CountdownCircleTimer>

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
        }}
        containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 20 }}
      />
    </SafeAreaView>
  );
}
