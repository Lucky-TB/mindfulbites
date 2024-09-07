import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';

const AsyncStorageTest = () => {
  const [text, setText] = useState('');
  const [storedText, setStoredText] = useState('');

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@test_key', text);
      console.log('Data saved:', text);
      
      // Update the state to show the latest stored data
      setStoredText(text);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('@test_key');
      console.log('Data loaded:', data);
      setStoredText(data || 'No data found');
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem('@test_key');
      console.log('Data deleted');
      setStoredText('No data found');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <View className="p-5 bg-[#b6d9d7] flex-1 justify-center items-center">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter text to store"
        className="border-2 border-[#478385] bg-white rounded-lg p-4 mb-5 w-full max-w-[80%]"
        placeholderTextColor="#2f5456"
      />
      <Button 
        title="Save Data" 
        onPress={saveData} 
        className="bg-[#478385] p-3 rounded-lg mb-2"
      />
      <Button 
        title="Load Data" 
        onPress={loadData} 
        className="bg-[#2f5456] p-3 rounded-lg mb-2"
      />
      <Button 
        title="Delete Data" 
        onPress={deleteData} 
        className="bg-red-500 p-3 rounded-lg mb-5"
      />
      
      <Text className="text-[#112122] text-lg">Stored Data: {storedText}</Text>
    </View>
  );
};


export default AsyncStorageTest;
