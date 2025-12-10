// components/SocialLoginButtons.tsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FacebookIcon, FingerprintIcon, GoogleIcon } from '../../svgs/SVGAuth';

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
      {/* Google Button */}
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
        <GoogleIcon width={35} height={35} />
      </TouchableOpacity>

      {/* Facebook Button */}
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
        <FacebookIcon width={35} height={35} />
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
        <FingerprintIcon width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;