import ButtonComponent from "@/components/Button";
import { Logo_yellow } from "@/svgs/SVGLaunch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
  const router = useRouter();

  // Tạo animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // scale bắt đầu nhỏ hơn 1

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // mờ dần ra
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, // phóng to từ 0.8 → 1
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLoginPress = async () => {
    const seen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (seen === "true") router.replace("/auth/login");
    else router.replace("/onboarding/StepA");
  };

  const handleSignUpPress = async () => {
    const seen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (seen === "true") router.replace("/auth/signup");
    else router.replace("/onboarding/StepA");
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <SafeAreaView className="flex-1 bg-OrangeBase justify-center items-center">
        <Logo_yellow />
        <Text className="font-medium text-Font_2 my-10 text-center text-base px-4 leading-6">
          Lorem ipsum dolor sit amet, consectetur{"\n"}adipiscing elit, sed do
          eiusmod.
        </Text>
        <ButtonComponent
          title="Log In"
          background="YellowBase"
          onPress={handleLoginPress}
        />
        <ButtonComponent
          title="Sign Up"
          background="YellowBase"
          onPress={handleSignUpPress}
        />

        {/* Reset Onboarding */}
        {/* <ButtonComponent
          title="Reset Onboarding"
          background="YellowBase"
          onPress={async () => {
            await AsyncStorage.removeItem("hasSeenOnboarding");
            alert("Onboarding sẽ xuất hiện lại khi mở app lần sau!");
          }}
        /> */}
      </SafeAreaView>
    </Animated.View>
  );
};

export default Welcome;
