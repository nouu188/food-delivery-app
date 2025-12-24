import ContactItem from '@/components/common/contact/ContactItem';
import Header from '@/components/common/Header';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactUs() {
  const handleGoToFAQ = () => {
    router.push('/HelpFAQs');
  };

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      <Header title="Contact Us" />

      <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
        <Text className="text-base text-center mb-6 text-gray-700">
          How Can We Help You?
        </Text>

        <View className="flex-row justify-center mb-10">
          <TouchableOpacity
            onPress={handleGoToFAQ}
            className="bg-pink-100 px-6 py-3 rounded-full mr-4"
            activeOpacity={0.7}
          >
            <Text className="text-black text-base font-medium">FAQ</Text>
          </TouchableOpacity>

          <View className="bg-red-600 px-6 py-3 rounded-full">
            <Text className="text-white text-base font-medium">Contact Us</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="w-full pb-20">
            <ContactItem icon="headset-outline" title="Customer service" />
            <ContactItem icon="globe-outline" title="Website" />
            <ContactItem icon="logo-whatsapp" title="Whatsapp" />
            <ContactItem icon="logo-facebook" title="Facebook" />
            <ContactItem icon="logo-instagram" title="Instagram" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}