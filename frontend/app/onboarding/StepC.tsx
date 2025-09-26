import Indicator from "@/components/onboarding/Indicator";
import MainButton from "@/components/onboarding/MainButton";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { DeliveryIcon, Image3 } from "@/svgs/SVGOnboarding";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StepC = () => {
  const router = useRouter();
  const { currentStep } = useOnboardingStore();

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current; // bắt đầu từ 50px bên phải

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

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <SafeAreaView className="flex-1">
        <View className="absolute inset-0 z-0">
          <Image3
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </View>

        {/* Content box */}
        <View className="absolute bottom-0 w-full h-[43%] bg-white rounded-t-3xl z-20 items-center p-8">
          <DeliveryIcon />
          <Text className="text-3xl font-extrabold text-OrangeBase my-3">
            Fast Delivery
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
            <MainButton
              title="Get Started"
              onPress={() => router.replace("/login/login")}
            />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default StepC;
