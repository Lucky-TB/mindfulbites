import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View, Dimensions } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#dbeceb' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }} scrollEnabled={ false }>
        <View style={{ width: '100%', alignItems: 'center', minHeight: screenHeight * 0.95 }}>
          {/*<Image 
            source={images.logo}
            style={{ width: screenWidth * 0.85, height: screenHeight * 0.1, marginTop: 30 }}
            resizeMode="contain"
  />*/}

          

          <Image 
            source={images.cards}
            style={{ width: screenWidth * 0.90, height: screenHeight * 0.37, marginTop: 70, marginRight: 10 }} // Increased size
            resizeMode="contain"
          />

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: screenHeight * 0.035, color: '#112122', fontWeight: 'bold', textAlign: 'center', lineHeight: 30 }}>
              Savor the Moment with {''}
              <Text style={{ color: '#88bdbc' }}>Mindful Bites</Text>
            </Text>
          </View>

          <Text style={{ fontSize: screenHeight * 0.019, color: '#112122', textAlign: 'center', marginTop: 25, lineHeight: screenHeight * 0.025 }}>
            Discover Calm and Nourishment: Let Us Guide Your Journey to Mindful Eating
          </Text>

        
          <CustomButton 
            title="Begin Your Mindful Journey"
            handlePress={() => router.push('/home')}
            containerStyles={{ width: screenWidth * 0.70, height: 40, marginTop: 42 }} // Increased marginTop for spacing
          />
        </View>
      </ScrollView>
      
      <StatusBar backgroundColor='#161622' style='dark' />
    </SafeAreaView>
  );
}