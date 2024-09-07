import AsyncStorage from '@react-native-async-storage/async-storage'
// npm install @react-native-async-storage/async-storage


const saveRecipesToStorage = async (newRecipes) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
    console.log('Recipes saved:', newRecipes); // Log saved recipes
    setRecipes(newRecipes);
  } catch (error) {
    console.error('Error saving recipes to storage:', error);
  }
};

const loadRecipesFromStorage = async () => {
  try {
    const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedRecipes) {
      console.log('Loaded recipes:', JSON.parse(savedRecipes)); // Log loaded recipes
      setRecipes(JSON.parse(savedRecipes));
    } else {
      console.log('No recipes found in storage.'); // Log if nothing is found
    }
  } catch (error) {
    console.error('Error loading recipes from storage:', error);
  }
};

const deleteAllRecipes = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('All recipes deleted'); // Log when recipes are deleted
    setRecipes([]);
  } catch (error) {
    console.error('Error deleting recipes from storage:', error);
  }
};