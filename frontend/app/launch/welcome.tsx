import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { Yellow_Logo } from '@/assets/icons';

export default function WelcomeScreen() {
  const router = useRouter();
  const { checkOnboardingStatus } = useOnboarding();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAuthNavigation = async (screen: 'login' | 'signup') => {
    const hasSeenOnboarding = await checkOnboardingStatus();

    if (hasSeenOnboarding) {
      router.replace(screen === 'login' ? '/(auth)/Login' : '/(auth)/SignUp');
    } else {
      router.replace('/(onboarding)');
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <SafeAreaView className="flex-1 bg-secondary-base">
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-12">
            <Yellow_Logo />
          </View>

          <Text className="text-primary-light text-base text-center leading-6 mb-16 px-4">
            Your favorite food delivered fast to your door
          </Text>

          <View className="w-full gap-y-4">
            <TouchableOpacity
              onPress={() => handleAuthNavigation('login')}
              className="bg-primary-base h-14 rounded-full items-center justify-center active:bg-primary-dark"
            >
              <Text className="text-secondary-base text-lg font-bold">
                Log In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAuthNavigation('signup')}
              className="bg-primary-base h-14 rounded-full items-center justify-center active:bg-primary-dark"
            >
              <Text className="text-secondary-base text-lg font-bold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.replace('/(main)/(tabs)/Home')}
            className="mt-6"
          >
            <Text className="text-primary-light text-sm">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
