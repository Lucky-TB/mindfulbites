import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Dimensions, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { BlurView } from 'expo-blur';
import { LineChart } from 'react-native-chart-kit';
import { MoodContext } from '../../components/MoodContext';

const { width: screenWidth } = Dimensions.get('window');

export default function SettingsTab() {
  const [currentMood, setCurrentMood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { moodHistory } = useContext(MoodContext);

  const generateChartData = () => {
    if (moodHistory.length === 0) {
      return { labels: [], datasets: [] }; // Return empty data for chart if no mood history
    }
    return {
      labels: moodHistory.map((_, index) => `Entry ${index + 1}`),
      datasets: [
        {
          data: moodHistory.map(mood => mood + 1),
        },
      ],
    };
  };

  const loadCurrentMood = useCallback(async () => {
    try {
      const storedMood = await AsyncStorage.getItem('@current_mood');
      setCurrentMood(storedMood || '0');
    } catch (error) {
      console.error('Error loading current mood:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCurrentMood();
    }, [loadCurrentMood])
  );

  const getMoodColor = (mood) => {
    switch (parseInt(mood)) {
      case 0: return '#d3e6e4';
      case 1: return '#add8d6';
      case 2: return '#88bdbc';
      case 3: return '#5ea4a3';
      case 4: return '#3f7e7d';
      default: return '#88bdbc';
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-[#dbeceb]">
      <Text className="text-2xl font-bold text-[#88bdbc] mb-5">Current Mood</Text>
      
      <View
        style={{
          width: screenWidth * 0.5,
          height: screenWidth * 0.5,
          borderRadius: (screenWidth * 0.5) / 2,
          backgroundColor: getMoodColor(currentMood),
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text className="text-4xl font-bold text-white">
          {currentMood ? `${parseInt(currentMood) + 1}/5` : 'No mood set'}
        </Text>
      </View>

      <CustomButton 
        title="Check Data" 
        handlePress={() => setModalVisible(true)} 
        containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10 }}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={10} className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <View className="w-[90%] h-[70%] bg-[#b6d9d7] rounded-lg p-4 border-[#88bdbc] border-[2px] shadow-2xl">
            {moodHistory.length > 0 ? (
              <View className="mb-4">
                <LineChart
                  data={generateChartData()}
                  width={screenWidth - 70}
                  height={200}
                  withInnerLines={false}
                  fromZero={true}
                  bezier
                  chartConfig={{
                    backgroundColor: '#88BDBC',
                    backgroundGradientFrom: '#88BDBC',
                    backgroundGradientTo: '#37686a',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{ marginVertical: 8, borderRadius: 16, }}
                />
              </View>
            ) : (
              <Text className="text-xl text-center text-[#88bdbc]">No data entered</Text>
            )}
            <View className="mb-4">
              <CustomButton 
                title="Show Monthly Data" 
                handlePress={() => setModalVisible(true)} 
                containerStyles={{ marginBottom: 12 }}
              />
              <CustomButton 
                title="Show Weekly Data" 
                handlePress={() => setModalVisible(true)} 
                containerStyles={{ marginBottom: 12 }}
              />
              <CustomButton 
                title="Show Daily Data" 
                handlePress={() => setModalVisible(true)} 
                containerStyles={{ marginBottom: 12 }}
              />
            </View>
            <CustomButton
              title="Close" 
              handlePress={() => setModalVisible(false)}
            />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}