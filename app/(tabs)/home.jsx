import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodContext } from '../../components/MoodContext';
import { ModalContext } from '../../components/ModalContext';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeTab() {
  const navigation = useNavigation();
  const { setMood, addMood, moodHistory } = useContext(MoodContext);
  const { setModalVisible } = useContext(ModalContext);
  const [stressLevel, setStressLevel] = useState(0);

  const handleStressLevelChange = (value) => {
    setStressLevel(value);
  };

  const handleSubmitMood = async () => {
    if (moodHistory.length >= 5) {  
      Alert.alert('Limit Reached', 'You can only enter mood data up to 5 times.');
      return;
    }

    try {
      const roundedStressLevel = Math.round(stressLevel);  //saves current mood in async
      await AsyncStorage.setItem('@current_mood', String(roundedStressLevel)); 
      setMood(roundedStressLevel);
      addMood(roundedStressLevel);
      console.log('Mood saved and updated:', roundedStressLevel);
      Alert.alert('Mood Saved! 😊');
      console.log('Mood saved and updated:', roundedStressLevel);
      Alert.alert('Mood Saved! 😊'); //alert that confirms mood being saved
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const handleOpenModal = () => {  //make the modal visible and open the munchie page
    setModalVisible(true);
    navigation.navigate('Munchie');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#dbeceb]">
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-xl font-bold text-[#3B3B3B] text-center">
          How are you feeling today?
        </Text>

        <View className="my-10 w-4/5">
          <Text className="text-base text-center text-[#3B3B3B] mb-2">
            Adjust the slider to set your current stress level from a scale of 1-5:
          </Text>

          <Slider //mood slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={4}            
            value={stressLevel}
            onValueChange={handleStressLevelChange}
            minimumTrackTintColor="#88BDBC"
            maximumTrackTintColor="#C4C4C4"
            thumbTintColor="#88BDBC"
          />

          <View className="flex-row justify-between px-2 mt-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <Text
                key={val}
                className={`text-[#3B3B3B] ${Math.round(stressLevel) + 1 === val ? 'text-[#88BDBC]' : ''}`}
              >
                {val}
              </Text>
            ))}
          </View>
        </View>

        <CustomButton
          title="Submit Mood"  //submit mood button
          handlePress={handleSubmitMood}
          containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10, marginBottom: 10 }}
        />
        <CustomButton
          title="Ask Munchie"  //ask munchie button
          handlePress={handleOpenModal}
          containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10 }}
        />
      </View>
    </SafeAreaView>
  );
}