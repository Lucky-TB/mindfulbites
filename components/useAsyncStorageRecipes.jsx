// components/asyncStorageRecipes.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const STORAGE_KEY = '@last_recipes';

const useAsyncStorageRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  const saveRecipesToStorage = async (newRecipes) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
      setRecipes(newRecipes);
    } catch (error) {
      console.error('Error saving recipes to storage:', error);
    }
  };

  const loadRecipesFromStorage = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedRecipes) {
        setRecipes(JSON.parse(savedRecipes));
      }
    } catch (error) {
      console.error('Error loading recipes from storage:', error);
    }
  };

  const deleteAllRecipes = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setRecipes([]);
    } catch (error) {
      console.error('Error deleting recipes from storage:', error);
    }
  };

  useEffect(() => {
    loadRecipesFromStorage();
  }, []);

  return {
    recipes,
    saveRecipesToStorage,
    loadRecipesFromStorage,
    deleteAllRecipes
  };
};

export default useAsyncStorageRecipes;