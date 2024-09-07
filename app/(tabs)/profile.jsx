import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

export default function SettingsTab() {
  const [currentMood, setCurrentMood] = useState(null);

  // Load the current mood when the component mounts
  useEffect(() => {
    const loadCurrentMood = async () => {
      try {
        const storedMood = await AsyncStorage.getItem('@current_mood');
        setCurrentMood(storedMood || '0'); // Default to '0' if no mood is found
      } catch (error) {
        console.error('Error loading current mood:', error);
      }
    };
    loadCurrentMood();
  }, []);

  // Function to get the color based on mood
  const getMoodColor = (mood) => {
    switch (parseInt(mood)) {
      case 0: return '#d3e6e4'; // Low stress
      case 1: return '#add8d6'; // Mild stress
      case 2: return '#88bdbc'; // Moderate stress
      case 3: return '#5ea4a3'; // High stress
      case 4: return '#3f7e7d'; // Very high stress
      default: return '#88bdbc'; // Default to moderate
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-[#dbeceb]">
      <Text className="text-2xl font-bold text-[#88bdbc] mb-5">Current Mood</Text>
      
      {/* Circle for displaying the mood */}
      <View
        style={{
          width: screenWidth * 0.5,
          height: screenWidth * 0.5,
          borderRadius: (screenWidth * 0.5) / 2,
          backgroundColor: getMoodColor(currentMood), // Color based on mood
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text className="text-4xl font-bold text-white">
          {currentMood ? `${parseInt(currentMood) + 1}/5` : 'No mood set'}
        </Text>
      </View>
    </View>
  );
}