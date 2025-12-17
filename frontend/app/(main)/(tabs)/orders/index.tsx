// app/(tabs)/orders/index.tsx
import { food } from '@/assets/images/index';
import Header from '@/components/common/Header';
import OrderItem from '@/components/common/orders/OrderItem';
import OrderTabHeader from '@/components/common/orders/OrderTabHeader';
import { router } from "expo-router";
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyActive = [
  {
    id: '1001',
    name: 'Strawberry Shake',
    price: '$20.00',
    date: '29 Nov, 01:20 pm',
    itemsCount: 1,
    image: food.BS1, 
  },
  {
    id: '1002',
    name: 'Chicken Burger',
    price: '$20.00',
    date: '17 Oct, 01:20 pm',
    itemsCount: 1,
    image: food.BS2,
  },
  {
    id: '1003',
    name: 'Sushi Wave',
    price: '$20.00',
    date: '22 Apr, 01:20 pm',
    itemsCount: 2,
    image: food.BS3,
  },
  {
    id: '1004',
    name: 'Strawberry Shake',
    price: '$20.00',
    date: '29 Nov, 01:20 pm',
    itemsCount: 1,
    image: food.BS1,
  },
];

const dummyCompleted = [
  {
    id: '2001',
    name: 'Chicken Curry',
    price: '$50.00',
    date: '10 Nov, 08:00 pm',
    itemsCount: 2,
    image: food.BS2,
  },
  {
    id: '2002',
    name: 'Bean and Vegetable Burger',
    price: '$50.00',
    date: '10 Nov, 08:00 pm',
    itemsCount: 2,
    image: food.BS3,
  },
  {
    id: '2003',
    name: 'Coffee Latte',
    price: '$8.00',
    date: '10 Nov, 08:30 pm',
    itemsCount: 1,
    image: food.BS2,
  },
  {
    id: '2004',
    name: 'Strawberry Cheesecake Tea',
    price: '$22.00',
    date: '10 Oct, 03:00 pm',
    itemsCount: 2,
    image: food.BS4,
  },
];

const dummyCancelled = [
  {
    id: '3001',
    name: 'Sushi Wave',
    price: '$103.00',
    date: '02 Nov, 04:00 pm',
    itemsCount: 3,
    image: food.BS1,
  },
  {
    id: '3002',
    name: 'Fruit and Berry',
    price: '$15.00',
    date: '12 Oct, 03:15 pm',
    itemsCount: 2,
    image: food.BS3,
  },
];

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>('Active');

  // Chọn data theo tab hiện tại
  const orders = activeTab === 'Active' 
    ? dummyActive 
    : activeTab === 'Completed' 
      ? dummyCompleted 
      : dummyCancelled;

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      {/* Header với nút View History ở bên phải */}
      <Header 
        title="My Orders"
        rightComponent={
          <TouchableOpacity
            onPress={() => router.push('/orders/history')}
            className="px-4 py-2"
            activeOpacity={0.7}
          >
            <Text className="text-orange-600 font-semibold text-base">
              View History →
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Phần nội dung trắng bo góc */}
      <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
        {/* Tab Active | Completed | Cancelled */}
        <OrderTabHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Danh sách đơn hàng */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pb-32">
            {orders.length === 0 ? (
              <Text className="text-center text-gray-500 mt-10 text-base">
                No {activeTab.toLowerCase()} orders yet
              </Text>
            ) : (
              orders.map((order) => (
                <OrderItem
                  key={order.id}
                  {...order}
                  status={activeTab}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}