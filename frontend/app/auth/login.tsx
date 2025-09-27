import ButtonComponent from "@/components/Button";
import { ArrowLeftIcon } from "@/svgs/SVGAuth";
import { router } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const handleBack = () => {
  router.back();
};

const handleForgotPassword = () => {
  // Navigate to forgot password screen
  router.push("/auth/forgotPassword");
};

const Login = () => {
  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      {/* Header */}
      <View className="flex-row items-center justify-center px-8 py-16 m-3">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-Font_2 flex-1 text-center mr-8">
          Log In
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 flex bg-white rounded-t-3xl px-6 py-6 mb-2">
        {/* Welcome */}
        <View className="pt-5 pb-6">
          <Text className="text-2xl font-bold mb-2">Welcome</Text>
          <Text className="text-left font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-4">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="font-medium text-xl">Email or Mobile Number</Text>
            <View className="h-[45px] bg-Yellow_2 rounded-xl">
              <TextInput
                placeholder="example@example.com"
                className="flex-1 text-lg font-normal text-Font ml-3"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="font-medium text-xl">Password</Text>
            <View className="bg-Yellow_2 rounded-xl h-[45px]">
              <TextInput
                className="ml-3"
                secureTextEntry
                placeholder="********"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          className="self-end mb-8"
        >
          <Text className="text-orange-500 font-medium text-base">
            Forget Password
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <View className="flex items-center mt-8">
          <ButtonComponent title="Login" background="OrangeBase" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
