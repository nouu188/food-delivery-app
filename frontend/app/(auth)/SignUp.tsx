import Header from "@/components/common/Header";
import SocialLoginButtons from "@/components/common/auth/SocialLoginButtons";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "tamagui";

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        mobile: "",
        dateOfBirth: "",
    });
    const [loading, setLoading] = useState(false);

    const handleBack = () => router.replace("/launch/welcome");
    const handleLogin = () => router.push("/(auth)/Login");

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const formatPhoneNumber = (text: string) => {
        const numeric = text.replace(/\D/g, "");
        if (numeric.length <= 3) return numeric;
        if (numeric.length <= 6) return `${numeric.slice(0, 3)} ${numeric.slice(3)}`;
        return `${numeric.slice(0, 3)} ${numeric.slice(3, 6)} ${numeric.slice(6, 9)}`;
    };

    const formatDate = (text: string) => {
        const numeric = text.replace(/\D/g, "");
        if (numeric.length <= 2) return numeric;
        if (numeric.length <= 4) return `${numeric.slice(0, 2)} / ${numeric.slice(2)}`;
        return `${numeric.slice(0, 2)} / ${numeric.slice(2, 4)} / ${numeric.slice(4, 8)}`;
    };

    const handleSignUp = async () => {
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        // NOTE: Backend integration needed
        // TODO: Implement actual signup API call
        setLoading(true);
        try {
            // Backend: API call example
            // const response = await fetch('YOUR_API_URL/auth/signup', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // });
            // const data = await response.json();

            // Backend: Store auth token
            // await AsyncStorage.setItem('authToken', data.token);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => router.replace("/(main)/(tabs)/Home") },
            ]);
        } catch (error) {
            Alert.alert("Error", "Signup failed. Please try again.");
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTermsPress = () => {
        // NOTE: Navigate to Terms of Use page
        Alert.alert("Terms of Use", "Terms of Use content will be displayed here");
    };

    const handlePrivacyPress = () => {
        // NOTE: Navigate to Privacy Policy page
        Alert.alert("Privacy Policy", "Privacy Policy content will be displayed here");
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="New Account" onBack={handleBack} />

            <View className="flex-1 bg-white rounded-t-3xl px-4 py-4 justify-between">
                <View>
                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Full name</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl justify-center px-3">
                            <TextInput
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChangeText={(text) => updateFormData("fullName", text)}
                                className="text-base font-semibold text-Font"
                                placeholderTextColor="#6B7280"
                            />
                        </View>
                    </View>

                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Password</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-3">
                            <TextInput
                                secureTextEntry={!showPassword}
                                value={formData.password}
                                onChangeText={(text) => updateFormData("password", text)}
                                placeholder="Enter your password"
                                placeholderTextColor="#6B7280"
                                className="flex-1 text-base font-semibold text-Font"
                                autoCapitalize="none"
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

                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Email</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl justify-center px-3">
                            <TextInput
                                placeholder="example@example.com"
                                value={formData.email}
                                onChangeText={(text) => updateFormData("email", text)}
                                className="text-base font-semibold text-Font"
                                placeholderTextColor="#6B7280"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Mobile Number</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl flex-row items-center px-3">
                            <Text className="text-base font-semibold text-Font">+</Text>
                            <TextInput
                                placeholder="123 456 789"
                                value={formData.mobile}
                                onChangeText={(text) => updateFormData("mobile", formatPhoneNumber(text))}
                                className="flex-1 text-base font-semibold text-Font ml-2"
                                keyboardType="phone-pad"
                                placeholderTextColor="#6B7280"
                                maxLength={11}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-lg font-medium mb-1">Date of birth</Text>
                        <View className="h-[45px] bg-Yellow_2 rounded-xl justify-center px-3">
                            <TextInput
                                placeholder="DD / MM / YYYY"
                                value={formData.dateOfBirth}
                                onChangeText={(text) => updateFormData("dateOfBirth", formatDate(text))}
                                className="text-base font-semibold text-Font"
                                placeholderTextColor="#6B7280"
                                keyboardType="numeric"
                                maxLength={14}
                            />
                        </View>
                    </View>

                    <Text className="text-gray-500 text-center text-sm mb-6">
                        By continuing, you agree to{" "}
                        <Text className="text-orange-500 underline" onPress={handleTermsPress}>
                            Terms of Use
                        </Text>{" "}
                        and{" "}
                        <Text className="text-orange-500 underline" onPress={handlePrivacyPress}>
                            Privacy Policy
                        </Text>
                        .
                    </Text>

                    <View className="items-center mb-6">
                        <Button
                            width="50%"
                            height={50}
                            background="#E95322"
                            color="white"
                            fontSize={16}
                            fontWeight="800"
                            style={{ borderRadius: 30 }}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </View>

                    <View className="items-center">
                        <Text className="text-sm mb-2">or sign up with</Text>
                        <SocialLoginButtons />
                    </View>
                </View>

                <View className="flex-row justify-center items-center mb-1">
                    <Text className="text-gray-600 text-sm">Already have an account?</Text>
                    <TouchableOpacity onPress={handleLogin} className="ml-1">
                        <Text className="text-orange-500 font-medium text-sm">Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
