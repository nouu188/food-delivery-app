import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import ButtonComponent from "@/components/Button";
import { ArrowLeftIcon } from "@/svgs/SVGAuth";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
  router.back();
};

const handleForgotPassword = () => {
  // Navigate to forgot password screen
  router.push("/auth/forgotPassword");
};

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      {/* Header */}
      <View className="flex-row items-center justify-center px-8 py-14 m-3">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-Font_2 flex-1 text-center mr-8">
          Log In
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 flex bg-white rounded-t-3xl px-6 py-2">
        {/* Welcome */}
        <View className="pt-5 pb-6">
          <Text className="text-2xl font-bold mb-2">Welcome</Text>
          <Text className="text-left font-light text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-2">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="font-medium text-xl mb-1">
              Email or Mobile Number
            </Text>
            <View className="h-[45px] bg-Yellow_2 rounded-xl">
              <TextInput
                placeholder="example@example.com"
                className="flex-1 text-lg font-semibold text-Font ml-3"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="font-medium text-xl mb-1">Password</Text>
            <View className="bg-Yellow_2 rounded-xl h-[45px] flex-row items-center justify-between">
              <TextInput
                className="ml-3 flex-1 text-lg font-semibold text-Font"
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="mr-3"
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <Eye size={20} color="#E95322" />
                ) : (
                  <EyeOff size={20} color="#E95322" />
                )}
              </TouchableOpacity>
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
        <View className="flex items-center mt-4">
          <ButtonComponent
            title="Login"
            background="OrangeBase"
            color="white"
            onPress={() => router.replace("/home/homepage")}
          />
        </View>

        {/* Social Login Section */}
        <View className="items-center mt-4">
          <Text className="text-base"> or sign up with</Text>
          <SocialLoginButtons />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center mb-8 mt-8">
            <Text className="text-gray-600 text-base">
              Don't have an account? 
            </Text>
            <TouchableOpacity onPress={handleSignUp} className="ml-1">
              <Text className="text-orange-500 font-medium text-base">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

      </View>
    </SafeAreaView>
  );
};

export default Login;
