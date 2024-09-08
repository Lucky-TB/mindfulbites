import React, { useState, useEffect, useRef, useContext } from 'react';
import * as GoogleGenerativeAI from '@google/generative-ai';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { ModalContext } from '../../components/ModalContext';
import { GEMINI_API_KEY } from '@env';

const ModalComponent = ({ onSubmit }) => {
  const { modalVisible, setModalVisible } = useContext(ModalContext);
  const [height, setHeight] = useState(0);
  const [difflevel, setDiffLevel] = useState(0);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const closeModal = () => {
    setModalVisible(false);
    setText1('');
    setText2('');
    setDiffLevel(0); // Reset difflevel when closing modal
  };

  const handleSubmit = () => {
    if (text1.trim()) {
      onSubmit(text1, text2, difflevel); // Pass text1, text2, and difflevel to the callback
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
              className='border-2 border-[#2f5456] bg-[#dbeceb] rounded-lg p-4 mb-10'
              placeholder="Enter your feelings"
              placeholderTextColor="#112122"
              multiline
              onContentSizeChange={(contentWidth, contentHeight) => {
                setHeight(contentHeight);
              }}
              value={text1}
              onChangeText={setText1}
            />
            <TextInput
              style={[{ height }]}
              className='border-2 border-[#2f5456] bg-[#dbeceb] rounded-lg p-4 mb-4 mt-[-25]'
              placeholder="Enter any Specific Ingredients"
              placeholderTextColor="#112122"
              multiline
              onContentSizeChange={(contentWidth, contentHeight) => {
                setHeight(contentHeight);
              }}
              value={text2}
              onChangeText={setText2}
            />
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={2}
              step={1}
              value={difflevel}
              onValueChange={setDiffLevel} // Updated to setDiffLevel
              minimumTrackTintColor="#88BDBC"
              maximumTrackTintColor="#C4C4C4"
              thumbTintColor="#88BDBC"
            />

            <View className="flex-row justify-between px-2 mt-2">
              {['Easy', 'Medium', 'Hard'].map((val, index) => (
                <Text
                  key={index}
                  className={`text-[#3B3B3B] ${difflevel === index ? 'text-[#88BDBC]' : ''} font-medium`}
                >
                  {val}
                </Text>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#478385] p-4 rounded-lg mt-5 border-2"
          >
            <Text className="text-[#dbeceb] font-bold text-center">Submit</Text>
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

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = 'hello';
      const result = await model.generateContent(prompt);
      const text = result?.response?.text ? result.response.text() : 'No response available.';
      setMessages([{ text, user: false }]);
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
  
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = userInput;
  
    try {
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
      setUserInput(''); // Clear user input after sending
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const handleModalSubmit = async (text1, text2, difflevel) => {
    setLoading(true);
  
    // Display a loading message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: 'ChatBot Loading...', user: false }
    ]);
  
    // Construct the prompt using template literals
    const difficultyLevels = ['easy', 'medium', 'hard'];
    const prompt = `Feeling: ${text1}. Ingredients: ${text2}. Difficulty level: ${difficultyLevels[difflevel]}. Provide a creative recipe and incorporate uplifting advice related to cooking and the feelinsg im having. Ensure the response is engaging and empathetic.`;
  
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
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
      className={`p-3 my-1 rounded-2xl shadow-sm mt-4 mb-10 border-2 ${
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