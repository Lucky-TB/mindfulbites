import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
export const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const addMood = (mood) => {
    setMoodHistory(prev => [...prev, mood]);
    saveMoodHistory([...moodHistory, mood]);
  };

  const saveMoodHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('@mood_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving mood history:', error);
    }
  };

  const loadMoodHistory = async () => {
    try {
      const storedMoodHistory = await AsyncStorage.getItem('@mood_history');
      if (storedMoodHistory) {
        setMoodHistory(JSON.parse(storedMoodHistory));
      }
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  return (
    <MoodContext.Provider value={{ currentMood, setMood: setCurrentMood, moodHistory, addMood, loadMoodHistory }}>
      {children}
    </MoodContext.Provider>
  );
};