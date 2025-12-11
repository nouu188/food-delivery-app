// components/cart/CartSummary.tsx – ĐÃ SỬA HOÀN HẢO
import { useCartStore } from '@/store/useCartStore';
import { Text, View } from 'react-native';

export const CartSummary = () => {
  const { getTotal } = useCartStore();
  const total = getTotal();
  const subtotal = total - 8; // 5 tax + 3 delivery

  return (
    <View className="bg-gray-50 rounded-2xl p-5 mt-6 shadow-sm">
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600 text-base">Subtotal</Text>
        <Text className="font-bold text-gray-900">${subtotal.toFixed(2)}</Text>
      </View>

      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600 text-base">Tax and Fees</Text>
        <Text className="font-bold text-gray-900">$5.00</Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <Text className="text-gray-600 text-base">Delivery</Text>
        <Text className="font-bold text-gray-900">$3.00</Text>
      </View>

      <View className="h-px bg-gray-300 my-4" />

      <View className="flex-row justify-between">
        <Text className="text-xl font-bold text-gray-900">Total</Text>
        <Text className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};