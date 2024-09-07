import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageTest = () => {
  const [text, setText] = useState('');
  const [storedText, setStoredText] = useState('');

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@test_key', text);
      console.log('Data saved:', text);
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
    <View style={{ padding: 20 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter text to store"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Save Data" onPress={saveData} />
      <Button title="Load Data" onPress={loadData} />
      <Button title="Delete Data" onPress={deleteData} />
      <Text>Stored Data: {storedText}</Text>
    </View>
  );
};

export default AsyncStorageTest;