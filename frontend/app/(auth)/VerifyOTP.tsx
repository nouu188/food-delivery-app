import Header from "@/components/common/Header";
import { Button } from "@/components/common";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpFormData } from "@/utils/validation/auth.schema";
import authService from "@/services/api/auth.service";
import { showErrorAlert } from "@/utils/error-handler";
import { OtpType } from "@/types/api/auth";

export default function VerifyOTP() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string; type: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<VerifyOtpFormData>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const otpValue = watch('otp');

    const onSubmit = async (data: VerifyOtpFormData) => {
        if (!params.email || !params.type) {
            Alert.alert('Error', 'Missing required parameters');
            return;
        }

        setIsLoading(true);
        try {
            await authService.verifyOtp({
                identifier: params.email,
                otp: data.otp,
                type: params.type as OtpType,
            });

            Alert.alert('Success', 'OTP verified successfully!');

            router.push({
                pathname: '/(auth)/SetPassword',
                params: { email: params.email, otp: data.otp },
            });
        } catch (error: any) {
            showErrorAlert(error, 'Verification Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!params.email || !params.type) {
            Alert.alert('Error', 'Missing required parameters');
            return;
        }

        setResendLoading(true);
        try {
            await authService.resendOtp({
                identifier: params.email,
                type: params.type as OtpType,
            });

            Alert.alert('Success', 'New OTP has been sent to your email');
        } catch (error: any) {
            showErrorAlert(error, 'Failed to Resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Verify OTP" onBack={() => router.back()} />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
                <Text className="text-base font-light text-gray-600 text-center mb-2 leading-6">
                    Enter the 6-digit code sent to
                </Text>
                <Text className="text-base font-semibold text-center mb-10">{params.email}</Text>

                <View className="mb-6">
                    <Text className="text-lg font-medium mb-2">OTP Code</Text>
                    <Controller
                        control={control}
                        name="otp"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="h-[50px] bg-Yellow_2 rounded-xl px-4 justify-center">
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="Enter 6-digit code"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    className="text-base font-semibold text-Font text-center tracking-widest"
                                    placeholderTextColor="#9CA3AF"
                                    editable={!isLoading}
                                />
                            </View>
                        )}
                    />
                    {errors.otp && (
                        <Text className="text-red-500 text-sm mt-1 text-center">{errors.otp.message}</Text>
                    )}
                </View>

                <Button
                    title="Verify OTP"
                    background="OrangeBase"
                    color="white"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    disabled={isLoading || otpValue.length !== 6}
                />

                <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-600 text-sm">Didn't receive the code? </Text>
                    <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
                        <Text className="text-orange-500 font-medium text-sm">
                            {resendLoading ? 'Sending...' : 'Resend OTP'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-500 text-xs text-center mt-4">
                    Note: OTP expires in 10 minutes. Maximum 3 attempts allowed.
                </Text>
            </View>
        </SafeAreaView>
    );
}