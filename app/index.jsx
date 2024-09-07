import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const opacity = new Animated.Value(1); // Initial opacity

  useEffect(() => {
    // Fade out effect
    Animated.timing(opacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Automatically navigate to home after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/home', undefined, { shallow: true }); // Use shallow routing to avoid animations
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [router, opacity]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#dbeceb' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }} scrollEnabled={false}>
        <View style={{ width: '100%', alignItems: 'center', minHeight: screenHeight * 0.95 }}>
          {/* Optional logo image */}
          {/* <Image 
            source={images.logo}
            style={{ width: screenWidth * 0.85, height: screenHeight * 0.1, marginTop: 30 }}
            resizeMode="contain"
          /> */}

          <Animated.Image 
            source={images.cards}
            style={{ width: screenWidth * 0.90, height: screenHeight * 0.37, marginTop: 115, marginRight: 10, opacity }}
            resizeMode="contain"
          />

          <Animated.View style={{ opacity }}>
            <Text style={{ fontSize: screenHeight * 0.035, color: '#112122', fontWeight: 'bold', textAlign: 'center', lineHeight: 30 }}>
              Savor the Moment with {''}
              <Text style={{ color: '#88bdbc' }}>Mindful Bites</Text>
            </Text>
          </Animated.View>

          <Animated.Text style={{ fontSize: screenHeight * 0.019, color: '#112122', textAlign: 'center', marginTop: 25, lineHeight: screenHeight * 0.025, opacity }}>
            Discover Calm and Nourishment: Let Us Guide Your Journey to Mindful Eating
          </Animated.Text>
        </View>
      </ScrollView>
      
      <StatusBar backgroundColor='#161622' style='dark' />
    </SafeAreaView>
  );
}
