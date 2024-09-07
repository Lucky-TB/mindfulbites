import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const STORAGE_KEY = '@last_recipes';

export const useAsyncStoragerecipes = () => {
  const [recpies, setrecpies] = useState([]);  

  const saverecipesToStorage = async (activities) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error('Error saving recipes to storage:', error);
    }
  };

  const loadActivitiesFromStorage = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedRecipes) {
        setRecipes(JSON.parse(savedRecipes));
      }
    } catch (error) {
      console.error('Error loading recipes from storage:', error);
    }
  };

  
  
  const deleteAllRecpies = async () => {
    try {
       await AsyncStorage.removeItem(STORAGE_KEY);
       setRecipes([]);
    } catch(error) {
        console.error('Error deleting recipes from storage', error);
    } 
};

useEffect(() => {
    loadActivitiesFromStorage();
}, []);


return {
    activities,
    setActivities,
    saveActivitiesToStorage,
    loadActivitiesFromStorage,
    deleteAllActivities
  };
};
