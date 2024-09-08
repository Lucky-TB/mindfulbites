import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState(0); // Default mood value

  useEffect(() => {
    const loadMood = async () => {
      try {
        const storedMood = await AsyncStorage.getItem('@current_mood');
        setMood(storedMood !== null ? parseInt(storedMood) : 0);
      } catch (error) {
        console.error('Error loading mood:', error);
      }
    };
    loadMood();
  }, []);

  const updateMood = async (newMood) => {
    try {
      await AsyncStorage.setItem('@current_mood', String(newMood));
      setMood(newMood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  return (
    <MoodContext.Provider value={{ mood, setMood: updateMood }}>
      {children}
    </MoodContext.Provider>
  );
};