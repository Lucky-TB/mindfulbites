import React, { useContext, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import CustomButton from '../../components/CustomButton'; // Importing the CustomButton
import { ModalContext } from '../../components/ModalContext'; // Import ModalContext

const { width: screenWidth } = Dimensions.get('window');

export default function HomeTab() {
  const navigation = useNavigation();
  const { setModalVisible } = useContext(ModalContext); // Access setModalVisible from context
  const [stressLevel, setStressLevel] = useState(0); // 0: Low, 1: Medium, 2: High

  const handleStressLevelChange = (value) => {
    setStressLevel(value);
  };

  const handleOpenModal = () => {
    setModalVisible(true); // Open modal by setting visibility to true
    navigation.navigate('Suggestions'); // Navigate to Suggestions screen
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
            <Text className={`text-[#3B3B3B] ${stressLevel === 0 ? 'text-[#88BDBC]' : ''}`}>1</Text>
            <Text className={`text-[#3B3B3B] ${stressLevel === 1 ? 'text-[#88BDBC]' : ''}`}>2</Text>
            <Text className={`text-[#3B3B3B] ${stressLevel === 2 ? 'text-[#88BDBC]' : ''}`}>3</Text>
            <Text className={`text-[#3B3B3B] ${stressLevel === 3 ? 'text-[#88BDBC]' : ''}`}>4</Text>
            <Text className={`text-[#3B3B3B] ${stressLevel === 4 ? 'text-[#88BDBC]' : ''}`}>5</Text>
          </View>
        </View>

        <CustomButton
          title="Submit Mood"
          handlePress={handleOpenModal} // Trigger modal visibility and navigation
          containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10, marginBottom: 10 }}
        />
        <CustomButton
          title="Get Food Suggestions"
          handlePress={handleOpenModal} // Trigger modal visibility and navigation
          containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 15 }}
        />
      </View>
    </SafeAreaView>
  );
}