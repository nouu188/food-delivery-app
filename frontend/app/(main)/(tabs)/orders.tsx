import Header from '@/components/common/Header';
import OrderItem from '@/components/common/orders/OrderItem';
import OrderTabHeader from '@/components/common/orders/OrderTabHeader';
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import orderService from '@/services/api/order.service';
import { Order, OrderStatus } from '@/types/api/order';
import { showErrorAlert } from '@/utils/error-handler';

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>('Active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      let statuses: OrderStatus[] = [];
      if (activeTab === 'Active') {
        statuses = [
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.PREPARING,
          OrderStatus.READY_FOR_PICKUP,
          OrderStatus.PICKED_UP,
          OrderStatus.ON_THE_WAY,
        ];
      } else if (activeTab === 'Completed') {
        statuses = [OrderStatus.DELIVERED, OrderStatus.COMPLETED];
      } else {
        statuses = [OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.FAILED];
      }

      const response = await orderService.getOrders({
        page: 1,
        limit: 50,
      });

      const orderData = response?.data || [];
      const filteredOrders = Array.isArray(orderData)
        ? orderData.filter(order => statuses.includes(order.status))
        : [];

      setOrders(filteredOrders);
    } catch (error) {
      showErrorAlert(error, 'Failed to Load Orders');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day} ${month}, ${time}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
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

      <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
        <OrderTabHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading ? (
          <View className="flex-1 items-center justify-center pt-20">
            <ActivityIndicator size="large" color="#E95322" />
            <Text className="text-gray-500 mt-4">Loading orders...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => fetchOrders(true)}
                tintColor="#E95322"
              />
            }
          >
            <View className="pb-32">
              {orders.length === 0 ? (
                <View className="items-center pt-20">
                  <Text className="text-center text-gray-500 text-base">
                    No {activeTab.toLowerCase()} orders yet
                  </Text>
                  {activeTab === 'Active' && (
                    <TouchableOpacity
                      onPress={() => router.push('/(main)/(tabs)/Home')}
                      className="mt-6 px-8 py-3 rounded-full bg-[#E95322]"
                    >
                      <Text className="text-white font-semibold">Start Ordering</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                orders.map((order) => {
                  const displayName = order.restaurant_name || order.items?.[0]?.menu_item?.name || 'Order';
                  const itemCount = order.items?.length || 0;

                  return (
                    <OrderItem
                      key={order.id}
                      id={order.id}
                      name={displayName}
                      price={`$${order.total_amount}`}
                      date={formatDate(order.created_at)}
                      itemsCount={itemCount}
                      image={order.items?.[0]?.menu_item?.image_url
                        ? { uri: order.items[0].menu_item.image_url }
                        : undefined
                      }
                      status={activeTab}
                      restaurantId={order.restaurant_id}
                      hasReview={false}
                    />
                  );
                })
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}