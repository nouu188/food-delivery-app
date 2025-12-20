import Header from "@/components/common/Header";
import SocialLoginButtons from "@/components/common/auth/SocialLoginButtons";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/utils/validation/auth.schema";
import authService from "@/services/api/auth.service";
import { showErrorAlert, isErrorStatus } from "@/utils/error-handler";

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: '',
            email: '',
            password: '',
            phone: '',
        },
    });

    const handleBack = () => router.replace("/launch/welcome");
    const handleLogin = () => router.push("/(auth)/Login");

    const formatPhoneNumber = (text: string) => {
        const numeric = text.replace(/\D/g, "");
        return numeric;
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await authService.register({
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                phone: data.phone || undefined,
            });

            Alert.alert(
                "Success",
                "Account created successfully! Please check your email to verify your account.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/(auth)/Login"),
                    },
                ]
            );
        } catch (error: any) {
            if (isErrorStatus(error, 409)) {
                Alert.alert('Sign Up Failed', 'This email or phone number is already registered');
            } else {
                showErrorAlert(error, 'Sign Up Failed');
            }
        } finally {
            setIsLoading(false);
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
                        <Controller
                            control={control}
                            name="full_name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="h-[45px] bg-Yellow_2 rounded-xl justify-center px-3">
                                    <TextInput
                                        placeholder="Enter your full name"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        className="text-base font-semibold text-Font"
                                        placeholderTextColor="#6B7280"
                                        editable={!isLoading}
                                    />
                                </View>
                            )}
                        />
                        {errors.full_name && (
                            <Text className="text-red-500 text-sm mt-1">{errors.full_name.message}</Text>
                        )}
                    </View>

                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Email</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="h-[45px] bg-Yellow_2 rounded-xl justify-center px-3">
                                    <TextInput
                                        placeholder="example@example.com"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        className="text-base font-semibold text-Font"
                                        placeholderTextColor="#6B7280"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!isLoading}
                                    />
                                </View>
                            )}
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
                        )}
                    </View>

                    <View className="mb-3">
                        <Text className="text-lg font-medium mb-1">Password</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="h-[45px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-3">
                                    <TextInput
                                        secureTextEntry={!showPassword}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#6B7280"
                                        className="flex-1 text-base font-semibold text-Font"
                                        autoCapitalize="none"
                                        editable={!isLoading}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <Eye size={20} color="#E95322" />
                                        ) : (
                                            <EyeOff size={20} color="#E95322" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                        )}
                    </View>

                    <View className="mb-6">
                        <Text className="text-lg font-medium mb-1">Mobile Number (Optional)</Text>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="h-[45px] bg-Yellow_2 rounded-xl flex-row items-center px-3">
                                    <TextInput
                                        placeholder="0123456789"
                                        value={value}
                                        onChangeText={(text) => onChange(formatPhoneNumber(text))}
                                        onBlur={onBlur}
                                        className="flex-1 text-base font-semibold text-Font"
                                        keyboardType="phone-pad"
                                        placeholderTextColor="#6B7280"
                                        maxLength={10}
                                        editable={!isLoading}
                                    />
                                </View>
                            )}
                        />
                        {errors.phone && (
                            <Text className="text-red-500 text-sm mt-1">{errors.phone.message}</Text>
                        )}
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
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                            opacity={isLoading ? 0.7 : 1}
                        >
                            {isLoading ? <ActivityIndicator color="white" /> : "Sign Up"}
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
