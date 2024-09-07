import React, { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton'; // Importing the CustomButton
import { BlurView } from 'expo-blur'; // Import BlurView

const screenWidth = Dimensions.get('window').width;

const ChartComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [chartData, setChartData] = useState(null);

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

  const showChart = (data) => {
    setChartData(data);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-[#dbeceb]">
      <CustomButton title="Check Data" handlePress={() => setModalVisible(true)} containerStyles={{ width: screenWidth * 0.7, height: 50, marginTop: 10 }}/>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={10} className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <View className="w-full max-w-xl bg-[#dbeceb] rounded-lg p-4">
            {chartData && (
              <View className="mb-4">
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={300}
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
                  style={{ marginVertical: 8, borderRadius: 16, marginLeft: 5 }}
                />
              </View>
            )}
            <View className="mb-4">
                <CustomButton 
                    title="Show Monthly Data" 
                    handlePress={() => showChart(Monthdata)} 
                    containerStyles={{ marginBottom: 8 }} // Adjust the value as needed
                />
                <CustomButton 
                    title="Show Weekly Data" 
                    handlePress={() => showChart(Weekdata)} 
                    containerStyles={{ marginBottom: 8 }} // Adjust the value as needed
                />
                <CustomButton 
                    title="Show Daily Data" 
                    handlePress={() => showChart(Daydata)} 
                />
            </View>

            
            <CustomButton title="Close" handlePress={() => setModalVisible(false)}/>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default ChartComponent;