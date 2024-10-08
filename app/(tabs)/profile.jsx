import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, Text, Dimensions, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { BlurView } from 'expo-blur';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from 'victory-native';
import { MoodContext } from '../../components/MoodContext';

const { width: screenWidth } = Dimensions.get('window');

export default function SettingsTab() {
  const [currentMood, setCurrentMood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { moodHistory, loadMoodHistory } = useContext(MoodContext);

  const generateChartData = () => { //sets chart data to the ata in async
    return moodHistory.map((mood, index) => ({ x: `Entry ${index + 1}`, y: mood + 1 }));
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
      loadMoodHistory();
    }, [loadCurrentMood, loadMoodHistory])
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

  const resetMoodHistory = async () => {
    try {
      await AsyncStorage.removeItem('@mood_history');
      loadMoodHistory();
    } catch (error) {
      console.error('Error resetting mood history:', error);
    }
  };


  const checkTimeAndReset = () => { //auto reset at midnight
    const now = new Date();
    const targetHour = 0;
    const targetMinute = 0;

    if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
      resetMoodHistory();
    }
  };

  useEffect(() => {

    const interval = 60 * 1000;
    const timer = setInterval(checkTimeAndReset, interval);


    return () => clearInterval(timer);
  }, []);

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
                <VictoryChart //chart to show data using victory
                  width={screenWidth - 70}
                  height={300}
                  domainPadding={20}
                  style={{ parent: { borderRadius: 16 }, marginBottom: -20 }}
                  
                >
                  <VictoryAxis
                    style={{
                      axis: { stroke: "#2f5456" },
                      tickLabels: { fill: "#2f5456" },
                      grid: { stroke: "none" }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    domain={[1, 5]}
                    tickValues={[1, 2, 3, 4, 5]}
                    style={{
                      axis: { stroke: "#2f5456" },
                      tickLabels: { fill: "#2f5456" },
                      grid: { stroke: "none" }
                    }}
                  />
                  <VictoryLine
                    data={generateChartData()}
                    style={{
                      data: { stroke: "#2f5456", strokeWidth: 3 },
                      parent: { border: "1px solid #2f5456" }
                    }}
                  />
                  <VictoryScatter
                    data={generateChartData()}
                    size={6}
                    style={{
                      data: { fill: "#2f5456" }
                    }}
                  />
                </VictoryChart>
              </View>
            ) : (
              <Text className="text-3xl text-center mb-36 mt-20 font-bold text-[black]">No data entered</Text>
            )}
            <CustomButton
              title="Reset Data" 
              handlePress={() => { // reset data button and alerts
                Alert.alert(
                  'Reset Data',
                  'Are you sure you want to reset the chart data?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: resetMoodHistory }
                  ]
                );
              }}
              containerStyles={{ marginTop: 145 }}
            />
            <CustomButton
              title="Close"  //close button and set modal false
              handlePress={() => setModalVisible(false)}
              containerStyles={{ marginTop: 15, border: 2 }}
            />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}