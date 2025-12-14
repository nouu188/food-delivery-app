import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Facebook from '@/assets/icons/facebook.svg';
import Google from '@/assets/icons/google.svg';
import { Fingerprint } from '@tamagui/lucide-icons';

const SocialLoginButtons = () => {
  const handleGoogleLogin = () => {
    console.log('Đăng nhập bằng Google');
    // @react-native-google-signin/google-signin
  };

  const handleFacebookLogin = () => {
    console.log('Đăng nhập bằng Facebook');
    // @react-native-facebook-login hoặc expo-auth-session
  };

  return (
    <View className="flex-row justify-center items-center gap-2 mt-2">
      <TouchableOpacity
        onPress={handleGoogleLogin}
        activeOpacity={0.8}
        className="w-[46px] h-[46px] bg-white rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Google width={35} height={35} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleFacebookLogin}
        activeOpacity={0.8}
        className="w-[46px] h-[46px] bg-white rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Facebook width={35} height={35} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleFacebookLogin}
        activeOpacity={0.8}
        className="w-[46px] h-[46px] bg-white rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Fingerprint width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;