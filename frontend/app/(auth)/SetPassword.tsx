import { Button } from "@/components/common";
import Header from "@/components/common/Header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "@/services/api/auth.service";
import { showErrorAlert } from "@/utils/error-handler";

const SetPassword = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string; otp: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters");
            return;
        }

        if (!params.email || !params.otp) {
            Alert.alert("Error", "Missing required parameters");
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({
                email: params.email,
                otp: params.otp,
                new_password: password,
            });

            Alert.alert(
                "Success",
                "Password has been reset successfully! You can now login with your new password.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/(auth)/Login"),
                    },
                ]
            );
        } catch (error: any) {
            showErrorAlert(error, 'Failed to Reset Password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Set Password" onBack={() => router.back()} />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10">
                <Text className="text-base font-light text-gray-600 text-center mb-8 leading-6">
                    Create a new password for your account. Password must be at least 8 characters long.
                </Text>

                <View className="mb-5">
                    <Text className="text-lg font-medium mb-2">New Password</Text>
                    <View className="h-[50px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-4">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="Enter new password"
                            className="flex-1 text-base font-semibold text-Font"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <Eye size={22} color="#E95322" /> : <EyeOff size={22} color="#E95322" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-10">
                    <Text className="text-lg font-medium mb-2">Confirm Password</Text>
                    <View className="h-[50px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-4">
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirm}
                            placeholder="Re-enter password"
                            className="flex-1 text-base font-semibold text-Font"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? <Eye size={22} color="#E95322" /> : <EyeOff size={22} color="#E95322" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    title="Create New Password"
                    background="OrangeBase"
                    color="white"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading || !password || password !== confirmPassword}
                />
            </View>
        </SafeAreaView>
    );
};

export default SetPassword;
