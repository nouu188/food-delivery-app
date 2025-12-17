import { Facebook, Gmail } from "@/assets/icons";
import { Fingerprint } from "@tamagui/lucide-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const SocialLoginButtons = () => {
    const handleGoogleLogin = () => {
        console.log("Đăng nhập bằng Google");
        // @react-native-google-signin/google-signin
    };

    const handleFacebookLogin = () => {
        console.log("Đăng nhập bằng Facebook");
        // @react-native-facebook-login hoặc expo-auth-session
    };

    return (
        <View className="flex-row justify-center items-center gap-2 mt-2">
            <TouchableOpacity
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
                className="w-[46px] h-[46px] bg-[#FFDECF] rounded-full items-center justify-center shadow-lg"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                <Gmail width={20} height={20} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleFacebookLogin}
                activeOpacity={0.8}
                className="w-[46px] h-[46px] bg-[#FFDECF] rounded-full items-center justify-center shadow-lg"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                <Facebook width={20} height={20} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleFacebookLogin}
                activeOpacity={0.8}
                className="w-[46px] h-[46px] bg-[#FFDECF] rounded-full items-center justify-center shadow-lg"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                <Fingerprint width={35} height={35} color="#E95322" />
            </TouchableOpacity>
        </View>
    );
};

export default SocialLoginButtons;
