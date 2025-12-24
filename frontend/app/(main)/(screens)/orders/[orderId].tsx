import Header from '@/components/common/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import orderService from '@/services/api/order.service';
import { useCartStore } from '@/store/useCartStore';
import { Order, OrderStatus, CancelledBy } from '@/types/api/order';
import { showErrorAlert } from '@/utils/error-handler';

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { fetchCart } = useCartStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const fetchOrder = async (showRefreshIndicator = false) => {
    if (!orderId) return;

    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      showErrorAlert(error, 'Failed to Load Order');
      router.back();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleCancelOrder = () => {
    if (!order) return;

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            try {
              await orderService.cancelOrder(order.id, {
                cancellation_reason: 'Cancelled by customer',
                cancelled_by: CancelledBy.CUSTOMER,
              });
              Alert.alert('Success', 'Order cancelled successfully');
              fetchOrder();
            } catch (error) {
              showErrorAlert(error, 'Failed to Cancel Order');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  const handleReorder = async () => {
    if (!order) return;

    setIsReordering(true);
    try {
      await orderService.reorder(order.id);
      await fetchCart(); // Refresh cart
      Alert.alert(
        'Items Added to Cart',
        'Order items have been added to your cart',
        [
          { text: 'View Cart', onPress: () => router.push('/cart') },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      showErrorAlert(error, 'Failed to Reorder');
    } finally {
      setIsReordering(false);
    }
  };

  const canCancelOrder = (status: OrderStatus) => {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(status);
  };

  return (
    <SafeAreaView className="flex-1 bg-YellowBase">
      <Header title="Order Details" />

      <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E95322" />
            <Text className="text-gray-500 mt-4">Loading order details...</Text>
          </View>
        ) : !order ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Order not found</Text>
          </View>
        ) : (
          <>
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Order No. {order.id.substring(0, 8)}
            </Text>
            <Text className="text-sm text-gray-500 mb-2">
              {formatDate(order.created_at)} • {formatTime(order.created_at)}
            </Text>

            <View className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
              <Text className="text-orange-800 font-semibold">
                Status: {order.status.replace(/_/g, ' ')}
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => fetchOrder(true)}
                  tintColor="#E95322"
                />
              }
            >
              {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                <View key={index} className="flex-row items-center mb-6">
                  {item.menu_item?.image_url ? (
                    <Image
                      source={{ uri: item.menu_item.image_url }}
                      className="w-20 h-20 rounded-xl"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-20 h-20 rounded-xl bg-gray-200 items-center justify-center">
                      <Text className="text-gray-500 text-xs">No Image</Text>
                    </View>
                  )}
                  <View className="flex-1 ml-4">
                    <Text className="text-base font-medium text-gray-900">
                      {item.menu_item?.name || item.item_name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      ${item.unit_price.toFixed(2)}
                    </Text>
                  </View>
                  <Text className="text-base text-gray-700 font-medium">
                    x{item.quantity}
                  </Text>
                </View>
              ))}

              <View className="border-t border-gray-200 pt-5 mt-4">
                <View className="flex-row justify-between mb-4">
                  <Text className="text-base text-gray-600">Subtotal</Text>
                  <Text className="text-base font-medium">
                    ${order.subtotal.toFixed(2)}
                  </Text>
                </View>
                {order.tax_amount > 0 && (
                  <View className="flex-row justify-between mb-4">
                    <Text className="text-base text-gray-600">Tax and Fees</Text>
                    <Text className="text-base font-medium">
                      ${order.tax_amount.toFixed(2)}
                    </Text>
                  </View>
                )}
                {order.delivery_fee > 0 && (
                  <View className="flex-row justify-between mb-4">
                    <Text className="text-base text-gray-600">Delivery</Text>
                    <Text className="text-base font-medium">
                      ${order.delivery_fee.toFixed(2)}
                    </Text>
                  </View>
                )}
                {order.discount_amount > 0 && (
                  <View className="flex-row justify-between mb-4">
                    <Text className="text-base text-green-600">Discount</Text>
                    <Text className="text-base font-medium text-green-600">
                      -${order.discount_amount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between pb-6 border-b border-gray-200">
                  <Text className="text-xl font-bold text-gray-900">Total</Text>
                  <Text className="text-xl font-bold text-red-600">
                    ${order.total_amount.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="mt-8 mb-20">
                {canCancelOrder(order.status) && (
                  <TouchableOpacity
                    className="bg-red-600 py-4 rounded-full mb-4"
                    activeOpacity={0.9}
                    onPress={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">
                        Cancel Order
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className="bg-orange-600 py-4 rounded-full"
                  activeOpacity={0.9}
                  onPress={handleReorder}
                  disabled={isReordering}
                >
                  {isReordering ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">
                      Order Again
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}