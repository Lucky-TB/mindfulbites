
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveList = async (list) => {
  try {
    const jsonValue = JSON.stringify(list); //saving it as JSON stringify
    await AsyncStorage.setItem('@my_list', jsonValue);
    console.log('List saved!');
  } catch (error) {
    console.error('Error saving list:', error);
  }
};

export const getList = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@my_list');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error retrieving list:', error);
  }
};