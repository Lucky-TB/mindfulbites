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
import * as Speech from 'expo-speech';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { StatusBar } from 'expo-status-bar';
import { ModalContext } from '../../components/ModalContext'; // Import ModalContext
import { BlurView } from 'expo-blur'; // Import BlurView
import Constants from 'expo-constants'
import { GEMINI_API_KEY } from '@env';

const ModalComponent = () => {
  const { modalVisible, setModalVisible } = useContext(ModalContext); // Access modal visibility state
  const [height, setHeight] = useState(0);
  const [text1, setText1] = useState('');
  const handleTextChange1 = (input) => {
    setText1(input);
  };
  const [text2, setText2] = useState('');
  const handleTextChange2 = (input) => {
    setText2(input);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible} // Use context state for visibility
      onRequestClose={() => setModalVisible(false)} // Close modal on back press
    >
      <BlurView intensity={10} className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
        <View className="w-[80%] min-h-[70%] max-h-[70%] bg-[#b6d9d7] rounded-2xl p-5 border-2 border-[#478385]">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-3xl font-pbold mb-5 mt-3 text-center">Info</Text>
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
            onPress={() => setModalVisible(false)} // Close modal on button press
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);
  const flatListRef = useRef(null);
  const { setModalVisible } = useContext(ModalContext);

  const API_KEY = GEMINI_API_KEY;

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = "hello";
      const result = await model.generateContent(prompt);

      const text = result?.response?.text ? result.response.text() : 'No response available.';
      showMessage({
        message: 'Welcome to Gemini Chat 🤖',
        description: text,
        type: 'info',
        icon: 'info',
        duration: 2000,
      });
      setMessages([{ text, user: false }]);
    };
    startChat();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = userMessage.text;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text ? result.response.text() : 'No response available.';
    setMessages((prevMessages) => [...prevMessages, { text, user: false }]);

    if (text && !isSpeaking) {
      Speech.speak(text);
      setIsSpeaking(true);
      setShowStopIcon(true);
    }

    setLoading(false);
    setUserInput('');
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(messages[messages.length - 1]?.text || '');
      setIsSpeaking(true);
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const renderMessage = ({ item }) => (
    <View
      className={`p-3 my-1 rounded-2xl shadow-sm ${
        item.user ? 'bg-blue-500 self-end' : 'bg-gray-200 self-start'
      } max-w-[80%]`}
    >
      <Text className={`${item.user ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
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
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        className="flex-1 mb-2 pt-10 pb-4"
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View className="flex-row items-center bg-[#88BDBC] p-3 rounded-full shadow-md">
        <TouchableOpacity
          className="bg-[#619fa0] p-3 rounded-full shadow-md"
          onPress={toggleSpeech}
        >
          {isSpeaking ? (
            <FontAwesome name="microphone-slash" size={24} color="white" />
          ) : (
            <FontAwesome name="microphone" size={24} color="white" />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          className="flex-1 mx-3 p-3 bg-[#b6d9d7] rounded-full shadow-sm text-gray-800 placeholder-gray-500"
          placeholderTextColor="#aaa"
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

      <ModalComponent/>
      
    </View>
  );
};


export default GeminiChat;