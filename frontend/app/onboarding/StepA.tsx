import Indicator from "@/components/onboarding/Indicator";
import MainButton from "@/components/onboarding/MainButton";
import SkipButton from "@/components/onboarding/SkipButton";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Image1, OrderIcon } from "@/svgs/SVGOnboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StepA = () => {
  const router = useRouter();
  const { currentStep, nextStep } = useOnboardingStore();

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const slideAnim = useRef(new Animated.Value(50)).current; // Y dịch chuyển từ 50px

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    nextStep(); // tăng step trong store
    router.replace("/onboarding/StepB"); // chuyển sang màn StepB
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <SafeAreaView className="flex-1">
        {/* Skip Button */}
        <View className="absolute top-14 right-6 z-30">
          <SkipButton />
        </View>

        {/* Image Background */}
        <View className="absolute inset-0 z-0">
          <Image1
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </View>

        {/* Content box */}
        <View className="absolute bottom-0 w-full h-[43%] bg-white rounded-t-3xl z-20 items-center p-8">
          <OrderIcon />
          <Text className="text-3xl font-extrabold text-OrangeBase my-3">
            Order For Food
          </Text>
          <Text className="text-center mt-2 px-4 font-bold text-Font leading-[14px] font-[LeagueSpartan]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna.
          </Text>

          {/* Progress Indicator */}
          <View className="mt-10">
            <Indicator currentStep={currentStep} />
          </View>

          {/* Next Button */}
          <View className="mt-8 w-full px-8 items-center">
            <MainButton title="Next" onPress={handleNext} />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default StepA;
