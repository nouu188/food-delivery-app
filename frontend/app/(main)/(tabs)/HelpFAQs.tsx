// app/(tabs)/HelpFAQs.tsx
import Header from '@/components/common/Header';
import FAQItem from '@/components/common/contact/FAQItem'; // giữ nguyên nếu bạn đã có component này
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyFAQs = [
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pellentesque congue libero, vel tincidunt tortor placerat a. Proin ut diam quam. Aenean in sagittis magna, ut feugiat diam.",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
];

export default function HelpFAQs() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General'); // TODO: Backend - lọc FAQ theo category

  const handleGoToContact = () => {
    router.push('./Contact'); 
  };

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      <Header title="Help & FAQs" />

      {/* Nội dung trắng bo góc trên - giống BestSeller */}
      <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
        <Text className="text-base text-center mb-6 text-gray-700">
          How Can We Help You?
        </Text>

        {/* Tab FAQ / Contact Us */}
        <View className="flex-row justify-center mb-8">
          {/* FAQ - active */}
          <View className="bg-red-600 px-7 py-3.5 rounded-full mr-4">
            <Text className="text-white text-base font-medium">FAQ</Text>
          </View>

          {/* Contact Us - inactive */}
          <TouchableOpacity
            onPress={handleGoToContact}
            className="bg-pink-100 px-7 py-3.5 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-black text-base font-medium">Contact Us</Text>
          </TouchableOpacity>
        </View>

        {/* Category buttons: General (active), Account, Services */}
        <View className="flex-row justify-center gap-3 mb-7">
          <TouchableOpacity
            onPress={() => setSelectedCategory('General')}
            className={`px-6 py-2.5 rounded-full ${
              selectedCategory === 'General' ? 'bg-red-600' : 'bg-white border border-gray-300'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === 'General' ? 'text-white' : 'text-gray-700'
              }`}
            >
              General
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedCategory('Account')}
            className={`px-6 py-2.5 rounded-full ${
              selectedCategory === 'Account' ? 'bg-red-600' : 'bg-white border border-gray-300'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === 'Account' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedCategory('Services')}
            className={`px-6 py-2.5 rounded-full ${
              selectedCategory === 'Services' ? 'bg-red-600' : 'bg-white border border-gray-300'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === 'Services' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Services
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search bar với icon kính lúp bên phải */}
        <View className="relative mb-7">
          <TextInput
            className="h-12 pl-5 pr-12 bg-white border border-gray-300 rounded-full text-base"
            placeholder="Search"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          <View className="absolute right-4 top-1/2 -translate-y-1/2">
            <Ionicons name="search" size={24} color="#FF6B00" />
          </View>
        </View>

        {/* TODO: Backend - Lấy danh sách FAQ từ API, lọc theo selectedCategory và search */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pb-32"> {/* padding bottom lớn để tránh bị che bởi bottom tab */}
            {/* Thay dummyFAQs bằng data từ API sau */}
            {/* Ví dụ: filteredFAQs = faqs.filter(...) */}
            {dummyFAQs.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------- GHI CHÚ CHO BACKEND -------------------------- */

// 1. API cần cung cấp:
//    GET /api/faqs?category=General|Account|Services&search=keyword
//    Response: { data: [{ id, question, answer }] }

// 2. Trong component sau này:
//    - Gọi API khi mount và khi thay đổi category/search
//    - Thay dummyFAQs bằng data từ API
//    - Thêm loading state + empty state nếu cần

// 3. Category active: hiện tại dùng state local để đổi màu
//    → Khi có backend, active tab có thể dựa vào param URL hoặc default "General"