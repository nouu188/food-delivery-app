import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star } from "@tamagui/lucide-icons";
import orderService from "@/services/api/order.service";
import reviewService from "@/services/api/review.service";
import { Order } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

export default function ReviewScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        if (!orderId) {
            Alert.alert("Error", "Order ID is required");
            router.back();
            return;
        }

        try {
            setIsLoading(true);
            const orderData = await orderService.getOrderById(orderId);
            setOrder(orderData);
        } catch (error) {
            showErrorAlert(error, "Failed to Load Order");
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!order) return;

        if (rating < 1 || rating > 5) {
            Alert.alert("Error", "Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.createReview({
                order_id: order.id,
                restaurant_id: order.restaurant_id,
                rating,
                comment: comment.trim() || undefined,
            });

            Alert.alert("Success", "Thank you for your review!", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            showErrorAlert(error, "Failed to Submit Review");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Leave a Review" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center">
                    <ActivityIndicator size="large" color="#E95322" />
                    <Text className="text-gray-500 mt-4">Loading order details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Leave a Review" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center px-8">
                    <Text className="text-xl font-medium text-gray-600 text-center">Order not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Leave a Review" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
                <View className="items-center">
                    {order.items &&
                    Array.isArray(order.items) &&
                    order.items.length > 0 &&
                    order.items[0].menu_item?.image_url ? (
                        <Image
                            source={{ uri: order.items[0].menu_item.image_url }}
                            className="w-40 h-32 rounded-2xl"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-40 h-32 rounded-2xl bg-gray-200 items-center justify-center">
                            <Text className="text-gray-500">No Image</Text>
                        </View>
                    )}
                    <Text className="mt-4 text-lg font-bold text-[#070707]">
                        {order.restaurant_name || "Restaurant"}
                    </Text>
                    <Text className="mt-1 text-sm text-[#6B7280]">
                        {order.items && Array.isArray(order.items) ? order.items.length : 0} item
                        {order.items && Array.isArray(order.items) && order.items.length > 1 ? "s" : ""}
                    </Text>
                    <Text className="mt-2 text-center text-[#6B7280] font-semibold">
                        We would love to know what you{`\n`}think of your order.
                    </Text>

                    <View className="flex-row mt-6">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const active = i + 1 <= rating;
                            return (
                                <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setRating(i + 1)}>
                                    <Star
                                        size={26}
                                        color="#E95322"
                                        fill={active ? "#E95322" : "transparent"}
                                        strokeWidth={2}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text className="mt-6 text-[#6B7280] font-semibold">Leave us your comment!</Text>

                    <View className="mt-4 w-full rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Write Review..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            style={{ minHeight: 70, color: "#070707" }}
                        />
                    </View>

                    <View className="flex-row mt-6 w-full justify-between">
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => router.back()}
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-full"
                            style={{ backgroundColor: isSubmitting ? "#D1D5DB" : "#FFE3D6" }}
                        >
                            <Text className="text-[#E95322] font-semibold">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleSubmitReview}
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-full items-center justify-center"
                            style={{ backgroundColor: isSubmitting ? "#9CA3AF" : "#E95322", minWidth: 120 }}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white font-semibold">Submit</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text className="mt-6 text-xs text-[#9CA3AF]">Order #{order.order_number}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
