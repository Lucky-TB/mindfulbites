import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Modal, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton'; // Make sure the path is correct
import { BlurView } from 'expo-blur'; // Import BlurView
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

const Monthdata = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      data: [1, 3, 2, 5, 4, 6, 7, 5, 8, 3, 5, 9],
    },
  ],
};

const Weekdata = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
  datasets: [
    {
      data: [2, 5, 3, 7, 6],
    },
  ],
};

const Daydata = {
  labels: ['Morning', 'Mid-Day', 'Afternoon', 'Evening'],
  datasets: [
    {
      data: [4, 6, 2, 8],
    },
  ],
};

export default function SettingsTab() {
  const [currentMood, setCurrentMood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chartData, setChartData] = useState(null);

  // Load the current mood 
  useEffect(() => {
    const loadCurrentMood = async () => {
      try {
        const storedMood = await AsyncStorage.getItem('@current_mood');
        setCurrentMood(storedMood || '0'); // Default to '0' if no mood is found
      } catch (error) {
        console.error('Error loading current mood:', error);
      }
    };
    loadCurrentMood();
  }, []);

  // Function to get the color based on mood
  const getMoodColor = (mood) => {
    switch (parseInt(mood)) {
      case 0: return '#d3e6e4'; // Low stress
      case 1: return '#add8d6'; // Mild stress
      case 2: return '#88bdbc'; // Moderate stress
      case 3: return '#5ea4a3'; // High stress
      case 4: return '#3f7e7d'; // Very high stress
      default: return '#88bdbc'; // Default to moderate
    }
  };

  const showChart = (data) => {
    setChartData(data);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-[#dbeceb]">
      <Text className="text-2xl font-bold text-[#88bdbc] mb-5">Current Mood</Text>
      
      {/* Circle for displaying the mood */}
      <View
        style={{
          width: screenWidth * 0.5,
          height: screenWidth * 0.5,
          borderRadius: (screenWidth * 0.5) / 2,
          backgroundColor: getMoodColor(currentMood), // Color based on mood
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20, // Add some margin to create space for the button
        }}
      >
        <Text className="text-4xl font-bold text-white">
          {currentMood ? `${parseInt(currentMood) + 1}/5` : 'No mood set'}
        </Text>
      </View>

      {/* Check Data Button */}
      <CustomButton 
        title="Check Data" 
        handlePress={() => setModalVisible(true)} 
        containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10 }}
      />

      {/* Modal for displaying the chart */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={10} className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <View className="w-[90%] h-[70%] bg-[#b6d9d7] rounded-lg p-4 border-[#88bdbc] border-[2px] shadow-2xl">
            {chartData && (
              <View className="mb-4">
                <LineChart
                  data={chartData}
                  width={screenWidth - 70}
                  height={200}
                  chartConfig={{
                    backgroundColor: '#88BDBC',
                    backgroundGradientFrom: '#88BDBC',
                    backgroundGradientTo: '#37686a',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{ marginVertical: 8, borderRadius: 16, }}
                />
              </View>
            )}
            <View className="mb-4">
              <CustomButton 
                  title="Show Monthly Data" 
                  handlePress={() => showChart(Monthdata)} 
                  containerStyles={{ marginBottom: 12 }} // Adjust the value as needed
              />
              <CustomButton 
                  title="Show Weekly Data" 
                  handlePress={() => showChart(Weekdata)} 
                  containerStyles={{ marginBottom: 12 }} // Adjust the value as needed
              />
              <CustomButton 
                  title="Show Daily Data" 
                  handlePress={() => showChart(Daydata)} 
                  containerStyles={{ marginBottom: 12 }} // Adjust the value as needed
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
