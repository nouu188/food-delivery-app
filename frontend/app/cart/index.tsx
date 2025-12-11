// app/(tabs)/cart/index.tsx
import { CartCheckoutButton } from '@/components/cart/CartCheckoutButton';
import { CartEmpty } from '@/components/cart/CartEmpty';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import AuthHeader from '@/components/ui/AuthHeader';
import { useCartStore } from '@/store/useCartStore';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { items, getTotal } = useCartStore();
  const isEmpty = items.length === 0;

  if (isEmpty) return <CartEmpty />;

  return (
    <SafeAreaView className="flex-1 bg-orange-500">
      {/* Header + Title */}
      <View className="px-6 pt-4 pb-6">
        <AuthHeader title="Cart" />
      </View>

      {/* Nội dung trắng bo góc trên */}
      <View className="flex-1 bg-white rounded-t-[40px]">
        {/* Thông báo số món */}
        <View className="px-6 pt-6">
          <Text className="text-gray-600 text-lg">
            You have {items.length} items in the cart
          </Text>
        </View>

        {/* Danh sách món */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 mt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* Tổng tiền + Checkout */}
        <View className="px-6 pb-8 bg-white">
          <CartSummary total={getTotal()} />
          <CartCheckoutButton />
        </View>
      </View>
    </SafeAreaView>
  );
}