import React, { useState, useEffect, useRef, useContext } from 'react';
import * as GoogleGenerativeAI from '@google/generative-ai';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar as RNStatusBar,
} from 'react-native';
{/*import * as Speech from 'expo-speech';*/}
import { FontAwesome, Entypo } from '@expo/vector-icons';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { StatusBar } from 'expo-status-bar';
import { ModalContext } from '../../components/ModalContext'; // Import ModalContext
import { BlurView } from 'expo-blur'; // Import BlurView
import { GEMINI_API_KEY } from '@env';
{/*import useAsyncStorageRecipes from '../../components/asyncStorageRecipes';*/}
import Slider from '@react-native-community/slider';

const ModalComponent = ({ onSubmit }) => {
  const { modalVisible, setModalVisible } = useContext(ModalContext);
  const [height, setHeight] = useState(0);
  const [text1, setText1] = useState('');
  const handleTextChange1 = (input) => {
    setText1(input);
  };
  const [text2, setText2] = useState('');
  const handleTextChange2 = (input) => {
    setText2(input);
  };

  const closeModal = () => {
    setModalVisible(false);
    setText1('');
    setText2('');
  };

  const handleSubmit = () => {
    if (text1.trim()) {
      onSubmit(text1, text2); // Pass both text1 and text2 to the callback
    }
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <BlurView intensity={10} className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
        <View className="w-[80%] min-h-[70%] max-h-[70%] bg-[#b6d9d7] rounded-2xl p-5 border-2 border-[#478385]">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-3xl font-bold mb-5 mt-3 text-center">Info</Text>
            <TextInput
              style={[{ height }]}
              className='border-2 border-[#2f5456] bg-white rounded-lg p-4 mb-10'
              placeholder="Enter your feelings"
              placeholderTextColor="#112122"
              multiline
              onContentSizeChange={(contentWidth, contentHeight) => {
                setHeight(contentHeight);
              }}
              value={text1}
              onChangeText={handleTextChange1}
            />
            <TextInput
              style={[{ height }]}
              className='border-2 border-[#2f5456] bg-white rounded-lg p-4 mb-4 mt-[-25]'
              placeholder="Enter any Specific Ingredients"
              placeholderTextColor="#112122"
              multiline
              onContentSizeChange={(contentWidth, contentHeight) => {
                setHeight(contentHeight);
              }}
              value={text2}
              onChangeText={handleTextChange2}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#478385] p-4 rounded-lg mt-5 border-2"
          >
            <Text className="text-white font-bold text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);
  const flatListRef = useRef(null);
  const { setModalVisible } = useContext(ModalContext);
  const API_KEY = GEMINI_API_KEY;

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = 'hello';
      const result = await model.generateContent(prompt);
      const text = result?.response?.text ? result.response.text() : 'No response available.';
      setMessages([{ text, user: false }]);
      useEffect(() => { //This line gives warning be careful
        const loadStoredRecipes = async () => {
          await loadRecipesFromStorage(); 
        };
      
        loadStoredRecipes();
      }, []);
    };
    startChat();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    setLoading(true);
  
    // Display a loading message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: 'ChatBot Loading...', user: false }
    ]);
  
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = userInput;
  
    try {
      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text ? result.response.text() : 'No response available.';
  
      // Save AI response to storage
  
      // Update the messages with the chatbot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: responseText, user: false }
      ]);
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Failed to generate response.', user: false }
      ]);
    } finally {
      setLoading(false);
      setUserInput(''); // Clear user input after sending
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const handleModalSubmit = async (text1, text2) => {
    setLoading(true);
  
    // Display a loading message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: 'ChatBot Loading...', user: false }
    ]);
  
    // Construct the prompt using template literals
    const prompt = `This is what I am feeling: ${text1}. These are the ingredients I have: ${text2}. Please make me a recipe. Can you try to keep the recipe short and also try to cheer up the user by giving them help on their specific feelings`;
  
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text ? result.response.text() : 'No response available.';
  
      // Update the messages with the chatbot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: responseText, user: false }
      ]);
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Failed to generate response.', user: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      className={`p-3 my-1 rounded-2xl shadow-sm mt-4 mb-10 ${
        item.user || item.text === 'ChatBot Loading...' ? 'bg-[#b6d9d7] self-end' : 'bg-[#b6d9d7] self-start'
      } max-w-[80%]`}
    >
      <Text className={`${item.user || item.text === 'ChatBot Loading...' ? 'text-[#619fa0]' : 'text-gray-900'} text-lg font-semibold`}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 bg-[#dbeceb]">
      <RNStatusBar
        barStyle="dark-content"
        backgroundColor="#E9F0E8"
        translucent={false}
        hidden={false}
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        className="flex-1 mb-2 pt-10 pb-4"
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="flex-row items-center bg-[] rounded-3xl">
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          className="border-2 flex-1 mx-1 p-3 bg-[#b6d9d7] rounded-full text-gray-800 placeholder-black"
          placeholderTextColor="black"
        />
        {showStopIcon && (
          <TouchableOpacity
            className="bg-red-500 p-3 rounded-full shadow-md"
            onPress={ClearMessage}
          >
            <Entypo name="controller-stop" size={24} color="white" />
          </TouchableOpacity>
        )}
        {loading && <ActivityIndicator size="large" color="#4B5563" className="ml-2" />}
      </View>

      <ModalComponent onSubmit={handleModalSubmit} />
      
    </View>
  );
};

export default GeminiChat;