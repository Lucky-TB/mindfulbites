import React, { useContext, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import CustomButton from '../../components/CustomButton';
import { ModalContext } from '../../components/ModalContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const { width: screenWidth } = Dimensions.get('window');

export default function HomeTab() {
  const navigation = useNavigation();
  const { setModalVisible } = useContext(ModalContext);
  const [stressLevel, setStressLevel] = useState(0); // Initialize with 0

  const handleStressLevelChange = (value) => {
    setStressLevel(value); // Set stress level based on slider
  };

  const handleSubmitMood = async () => {
    try {
      // Save the stress level to AsyncStorage
      await AsyncStorage.setItem('@current_mood', String(stressLevel)); 
      console.log('Mood saved:', stressLevel + 1);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const handleOpenModal = () => {
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

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={4}
            step={0.5}
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
                className={`text-[#3B3B3B] ${stressLevel + 1 === val ? 'text-[#88BDBC]' : ''}`}
              >
                {val}
              </Text>
            ))}
          </View>
        </View>

        <CustomButton
          title="Submit Mood"
          handlePress={handleSubmitMood}
          containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10, marginBottom: 10 }}
        />
        <CustomButton
          title="Ask Munchie"
          handlePress={handleOpenModal}
          containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10 }}
        />
      </View>
    </SafeAreaView>
  );
}