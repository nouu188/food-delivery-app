import { Button } from "@/components/common";
import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SetPassword = () => {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (password !== confirm) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setLoading(true);

        // BACKEND CALL (khi có backend)
        // POST /api/auth/reset-password
        // Body: { emailOrPhone, newPassword: password }
        // → Backend cập nhật mật khẩu mới

        setTimeout(() => {
            setLoading(false);
            Alert.alert("Thành công", "Đặt lại mật khẩu thành công!", [
                { text: "OK", onPress: () => router.replace("/(auth)/Login") },
            ]);
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Set Password" onBack={() => router.back()} />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10">
                <Text className="text-base font-light text-gray-600 text-center mb-8 leading-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </Text>

                <View className="mb-5">
                    <Text className="text-lg font-medium mb-2">Password</Text>
                    <View className="h-[50px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-4">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!show1}
                            placeholder="••••••••"
                            className="flex-1 text-base font-semibold text-Font"
                        />
                        <TouchableOpacity onPress={() => setShow1(!show1)}>
                            {show1 ? <Eye size={22} color="#E95322" /> : <EyeOff size={22} color="#E95322" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-10">
                    <Text className="text-lg font-medium mb-2">Confirm Password</Text>
                    <View className="h-[50px] bg-Yellow_2 rounded-xl flex-row items-center justify-between px-4">
                        <TextInput
                            value={confirm}
                            onChangeText={setConfirm}
                            secureTextEntry={!show2}
                            placeholder="••••••••"
                            className="flex-1 text-base font-semibold text-Font"
                        />
                        <TouchableOpacity onPress={() => setShow2(!show2)}>
                            {show2 ? <Eye size={22} color="#E95322" /> : <EyeOff size={22} color="#E95322" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    title="Create New Password"
                    background="OrangeBase"
                    color="white"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading || !password || password !== confirm}
                />
            </View>
        </SafeAreaView>
    );
};

export default SetPassword;
