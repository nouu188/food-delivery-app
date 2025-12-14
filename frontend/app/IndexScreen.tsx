import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';
import SplashScreen from './launch/First';

export default function IndexScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/launch/welcome');
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
      <SplashScreen />
    </Animated.View>
  );
}
