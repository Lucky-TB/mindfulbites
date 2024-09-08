import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const STORAGE_KEY = '@current_mood';

const useAsyncStorageMood = () => {
  const [mood, setMood] = useState(0);

  const saveMoodToStorage = async (newMood) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(newMood));
      setMood(newMood);
    } catch (error) {
      console.error('Error saving mood to storage:', error);
    }
  };

  const loadMoodFromStorage = async () => {
    try {
      const savedMood = await AsyncStorage.getItem(STORAGE_KEY);
      setMood(savedMood !== null ? parseInt(savedMood) : 0);
    } catch (error) {
      console.error('Error loading mood from storage:', error);
    }
  };

  const deleteMoodFromStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setMood(0); 
    } catch (error) {
      console.error('Error deleting mood from storage:', error);
    }
  };

  useEffect(() => {
    loadMoodFromStorage();
  }, []);

  return {
    mood,
    saveMoodToStorage,
    loadMoodFromStorage,
    deleteMoodFromStorage
  };
};

export default useAsyncStorageMood;