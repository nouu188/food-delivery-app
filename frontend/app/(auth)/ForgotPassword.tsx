import { Button } from "@/components/common";
import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/utils/validation/auth.schema";
import authService from "@/services/api/auth.service";
import { showErrorAlert } from "@/utils/error-handler";
import { useToastStore } from "@/store/useToastStore";

const ForgotPassword = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToastStore((s) => s.show);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword({ email: data.email });

            showToast({
                type: "success",
                title: "Success",
                message: "OTP has been sent to your email. Please check your inbox.",
            });

            router.push({
                pathname: "/(auth)/VerifyOTP",
                params: { email: data.email, type: "PASSWORD_RESET" },
            });
        } catch (error: any) {
            showErrorAlert(error, "Failed to Send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Forgot Password" onBack={() => router.replace("/(auth)/Login")} />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
                <Text className="text-base font-light text-gray-600 text-center mb-10 leading-6">
                    Enter your email to receive an OTP code to reset your password
                </Text>

                <View className="mb-6">
                    <Text className="text-lg font-medium mb-2">Email</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="h-[50px] bg-Yellow_2 rounded-xl px-4 justify-center">
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="example@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="text-base font-semibold text-Font"
                                    placeholderTextColor="#9CA3AF"
                                    editable={!isLoading}
                                />
                            </View>
                        )}
                    />
                    {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>}
                </View>

                <Button
                    title="Send OTP"
                    background="OrangeBase"
                    color="white"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword;
