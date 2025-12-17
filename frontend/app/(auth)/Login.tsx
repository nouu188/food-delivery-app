/* eslint-disable react/no-unescaped-entities */
import SocialLoginButtons from "@/components/common/auth/SocialLoginButtons";
import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "tamagui";

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleForgotPassword = () => router.push("./ForgotPassword");
    const handleSignUp = () => router.push("./SignUp");

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            {/* Header */}
            <Header title="Log In" onBack={() => router.replace("/launch/welcome")} />

            {/* Content */}
            <View className="flex-1 bg-white rounded-t-3xl px-6 py-4 justify-between">
                {/* Top Section */}
                <View>
                    {/* Welcome */}
                    <Text className="text-2xl font-bold mb-2">Welcome</Text>
                    <Text className="text-base font-light mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                    </Text>

                    {/* Email Input */}
                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Email or Mobile Number</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl justify-center px-3">
                            <TextInput
                                placeholder="example@example.com"
                                className="text-base font-semibold text-Font"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#6B7280"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Password</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-3">
                            <TextInput
                                className="flex-1 text-base font-semibold text-Font"
                                secureTextEntry={!showPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#6B7280"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <Eye size={20} color="#E95322" />
                                ) : (
                                    <EyeOff size={20} color="#E95322" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={handleForgotPassword} className="self-end mb-4">
                        <Text className="text-orange-500 font-medium text-sm">Forgot Password</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <View className="items-center mb-4">
                        <Button
                            width="50%"
                            height={50}
                            background="#E95322"
                            color="white"
                            fontSize={16}
                            fontWeight="800"
                            style={{ borderRadius: 30 }}
                            onPress={() => router.replace("/(main)/(tabs)/Home")}
                        >
                            Log In
                        </Button>
                    </View>

                    {/* Social Login */}
                    <View className="items-center mb-4">
                        <Text className="text-sm mb-2">or sign up with</Text>
                        <SocialLoginButtons />
                    </View>
                </View>

                {/* Sign Up Link */}
                <View className="flex-row justify-center items-center mb-2">
                    <Text className="text-gray-600 text-sm">Don't have an account?</Text>
                    <TouchableOpacity onPress={handleSignUp} className="ml-1">
                        <Text className="text-orange-500 font-medium text-sm">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
