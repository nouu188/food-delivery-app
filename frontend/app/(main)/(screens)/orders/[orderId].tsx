// app/(tabs)/orders/[orderId].tsx
import { food } from '@/assets/images/index';
import Header from '@/components/common/Header';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data - sau này sẽ thay bằng API
const mockOrders: Record<string, any> = {
  '1001': {
    date: '29/11/24',
    time: '01:20 pm',
    items: [
      { name: 'Strawberry Shake', price: 20.00, qty: 1, image: food.BS1 },
    ],
    subtotal: 20.00,
    tax: 3.00,
    delivery: 3.00,
    total: 26.00,
  },
  '2001': {
    date: '10/11/24',
    time: '08:00 pm',
    items: [
      { name: 'Chicken Curry', price: 25.00, qty: 2, image: food.BS2 },
    ],
    subtotal: 50.00,
    tax: 7.50,
    delivery: 5.00,
    total: 62.50,
  },
  '3001': {
    date: '02/11/24',
    time: '04:00 pm',
    items: [
      { name: 'Sushi Wave', price: 34.33, qty: 3, image: food.BS3 },
    ],
    subtotal: 103.00,
    tax: 15.45,
    delivery: 8.00,
    total: 126.45,
  },
  // Fallback nếu orderId không tồn tại
  default: {
    date: '29/11/24',
    time: '01:20 pm',
    items: [
      { name: 'Strawberry Shake', price: 20.00, qty: 1, image: food.BS1 },
      { name: 'Broccoli Lasagna', price: 12.00, qty: 3, image: food.BS4 },
    ],
    subtotal: 56.00,
    tax: 8.40,
    delivery: 5.00,
    total: 69.40,
  },
};

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Lấy data theo orderId, fallback về default nếu không có
  const orderDetail = mockOrders[orderId || ''] || mockOrders['default'];

  // TODO: Backend - Gọi API: GET /api/orders/:orderId
  // Ví dụ: useEffect(() => { fetchOrder(orderId); }, [orderId]);

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      <Header title="Order Details" />

      <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
        {/* Order No. và ngày giờ */}
        <Text className="text-lg font-bold text-gray-900 mb-1">
          Order No. {orderId || '000000'}
        </Text>
        <Text className="text-sm text-gray-500 mb-6">
          {orderDetail.date} • {orderDetail.time}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Danh sách món ăn */}
          {orderDetail.items.map((item: any, index: number) => (
            <View key={index} className="flex-row items-center mb-6">
              <Image
                source={item.image}
                className="w-20 h-20 rounded-xl"
                resizeMode="cover"
              />
              <View className="flex-1 ml-4">
                <Text className="text-base font-medium text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
              <Text className="text-base text-gray-700 font-medium">
                x{item.qty}
              </Text>
            </View>
          ))}

          {/* Tổng kết giá */}
          <View className="border-t border-gray-200 pt-5 mt-4">
            <View className="flex-row justify-between mb-4">
              <Text className="text-base text-gray-600">Subtotal</Text>
              <Text className="text-base font-medium">
                ${orderDetail.subtotal.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-base text-gray-600">Tax and Fees</Text>
              <Text className="text-base font-medium">
                ${orderDetail.tax.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-6">
              <Text className="text-base text-gray-600">Delivery</Text>
              <Text className="text-base font-medium">
                ${orderDetail.delivery.toFixed(2)}
              </Text>
            </View>

            {/* Total */}
            <View className="flex-row justify-between pb-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">Total</Text>
              <Text className="text-xl font-bold text-red-600">
                ${orderDetail.total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Nút Order Again */}
          <TouchableOpacity
            className="bg-red-600 py-4 rounded-full mt-8 mb-20"
            activeOpacity={0.9}
            // TODO: Backend - Khi bấm → thêm lại các món vào giỏ hàng và chuyển về menu
            onPress={() => {
              console.log('Order Again pressed for order:', orderId);
              // Ví dụ: router.push('/(tabs)/home');
            }}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Order Again
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}