// components/orders/OrderItem.tsx
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  id: string;
  name: string;
  price: string;
  date: string;
  itemsCount: number;
  image: any; // thay bằng require('@/assets/images/...') thực tế
  status: 'Active' | 'Completed' | 'Cancelled';
};

export default function OrderItem({ id, name, price, date, itemsCount, image, status }: Props) {
  const handleViewDetails = () => {
    router.push(`./orders/${id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleViewDetails}
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex-row"
      activeOpacity={0.8}
    >
      <Image source={image} className="w-20 h-20 rounded-xl" />

      <View className="flex-1 ml-4">
        <Text className="font-semibold text-lg">{name}</Text>
        <Text className="text-2xl font-bold text-red-600 mt-1">{price}</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {date} • {itemsCount} items
        </Text>

        {/* Action buttons theo status */}
        <View className="flex-row mt-3 gap-3">
          {status === 'Active' && (
            <>
              <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
                <Text className="text-sm">Cancel Order</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-orange-100 px-4 py-2 rounded-full">
                <Text className="text-sm text-orange-600">Track Driver</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'Completed' && (
            <>
              <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
                <Text className="text-sm">Leave a review</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-orange-100 px-4 py-2 rounded-full">
                <Text className="text-sm text-orange-600">Order Again</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'Cancelled' && (
            <Text className="text-sm text-red-600 font-medium">Order cancelled</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}