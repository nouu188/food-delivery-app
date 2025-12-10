// app/auth/forgot-password.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ButtonComponent from "@/components/Button";
import AuthHeader from "@/components/ui/AuthHeader";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email hoặc số điện thoại");
      return;
    }

    setLoading(true);

    // BACKEND CALL (khi có backend)
    // POST /api/auth/forgot-password
    // Body: { emailOrPhone: email }
    // → Backend sẽ gửi OTP về email/SMS

    // Giả lập thành công sau 1.5s (để test UI)
    setTimeout(() => {
      setLoading(false);
      router.replace({
        pathname: "/auth/verifyOTP",
        params: { emailOrPhone: email },
      });
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      <AuthHeader title="Forgot Password" onBack={() => router.back()} />

      <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
        <Text className="text-base font-light text-gray-600 text-center mb-10 leading-6">
          Nhập email hoặc số điện thoại của bạn để nhận mã OTP và đặt lại mật khẩu
        </Text>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">Email hoặc Số điện thoại</Text>
          <View className="h-[50px] bg-Yellow_2 rounded-xl px-4 justify-center">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="text-base font-semibold text-Font"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <ButtonComponent
          title="Gửi mã OTP"
          background="OrangeBase"
          color="white"
          onPress={handleSendOTP}
          loading={loading}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;