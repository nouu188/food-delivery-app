import { AddressCard } from '@/components/cart/AddressCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { OrderItemRow } from '@/components/cart/OrderItemRow';
import AuthHeader from '@/components/ui/AuthHeader';
import { useCartStore } from '@/store/useCartStore';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
    const { items, getTotal } = useCartStore();

    return (
        <SafeAreaView className="flex-1 bg-orange-500">
            <AuthHeader title="Confirm Order" />

            <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6">
                <AddressCard address="778 Locust View Drive Oakland, CA" />

                <Text className="text-lg font-bold mt-6 mb-4">Order Summary</Text>

                <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                    {items.map((item) => (
                        <OrderItemRow key={item.id} item={item} />
                    ))}
                </ScrollView>

                <CartSummary total={getTotal()} />

                <View className="flex-row gap-3 mt-6">
                    <TouchableOpacity className="flex-1 bg-gray-200 py-4 rounded-full">
                        <Text className="text-center font-bold text-gray-700">Cancel Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/cart/payment')}
                        className="flex-1 bg-orange-500 py-4 rounded-full"
                    >
                        <Text className="text-white text-center font-bold">Place Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
