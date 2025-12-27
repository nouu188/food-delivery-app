import { useCartStore } from "@/store/useCartStore";
import { router } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";

type Props = {
    id: string;
    name: string;
    price: string;
    date: string;
    itemsCount: number;
    image?: ImageSourcePropType;
    status: "Active" | "Completed" | "Cancelled";
    restaurantId?: string;
    hasReview?: boolean;
};

export default function OrderItem({
    id,
    name,
    price,
    date,
    itemsCount,
    image,
    status,
    restaurantId,
    hasReview = false,
}: Props) {
    const openDrawer = useCartStore((s) => s.openDrawer);

    const handleViewDetails = () => {
        if (!id || id.trim() === '') {
            Alert.alert('Error', 'Invalid order ID');
            return;
        }
        router.push(`/orders/${id}`);
    };

    const handleLeaveReview = () => {
        if (!id || id.trim() === '') {
            Alert.alert('Error', 'Invalid order ID');
            return;
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            Alert.alert('Error', 'Invalid order format. Please try again.');
            console.error('Invalid order ID format:', id);
            return;
        }

        if (hasReview) {
            Alert.alert(
                'Already Reviewed',
                'You have already reviewed this order.',
                [
                    { text: 'OK', style: 'default' },
                    {
                        text: 'View Details',
                        onPress: () => router.push(`/orders/${id}`),
                    },
                ]
            );
            return;
        }

        router.push(`/review/${id}`);
    };

    const handleCancelOrder = () => {
        if (!id || id.trim() === '') {
            Alert.alert('Error', 'Invalid order ID');
            return;
        }
        router.push(`/cancel-order/${id}`);
    };

    const handleTrackDriver = () => {
        if (!id || id.trim() === '') {
            Alert.alert('Error', 'Invalid order ID');
            return;
        }
        router.push(`/live-tracking/${id}`);
    };

    const handleReorder = () => {
        if (!id || id.trim() === '') {
            Alert.alert('Error', 'Invalid order ID');
            return;
        }
        router.push(`/orders/${id}`);
    };

    const parsedPrice = Number(price.replace(/[^0-9.]/g, "")) || 0;

    return (
        <TouchableOpacity
            onPress={handleViewDetails}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex-row"
            activeOpacity={0.8}
        >
            {image ? (
                <Image source={image} className="w-20 h-20 rounded-xl" resizeMode="cover" />
            ) : (
                <View className="w-20 h-20 rounded-xl bg-gray-200 items-center justify-center">
                    <Text className="text-gray-400 text-xs">No Image</Text>
                </View>
            )}

            <View className="flex-1 ml-4">
                <Text className="font-semibold text-lg" numberOfLines={1}>{name}</Text>
                <Text className="text-2xl font-bold text-red-600 mt-1">{price}</Text>
                <Text className="text-sm text-gray-500 mt-1">
                    {date} • {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                </Text>

                <View className="flex-row mt-3 gap-3 flex-wrap">
                    {status === "Active" && (
                        <>
                            <TouchableOpacity
                                className="bg-gray-200 px-4 py-2 rounded-full"
                                activeOpacity={0.8}
                                onPress={handleCancelOrder}
                            >
                                <Text className="text-sm font-medium">Cancel Order</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-orange-100 px-4 py-2 rounded-full"
                                activeOpacity={0.8}
                                onPress={handleTrackDriver}
                            >
                                <Text className="text-sm text-orange-600 font-medium">Track Driver</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {status === "Completed" && (
                        <>
                            {!hasReview && (
                                <TouchableOpacity
                                    className="bg-gray-200 px-4 py-2 rounded-full"
                                    activeOpacity={0.8}
                                    onPress={handleLeaveReview}
                                >
                                    <Text className="text-sm font-medium">Leave a Review</Text>
                                </TouchableOpacity>
                            )}
                            {hasReview && (
                                <View className="bg-green-100 px-4 py-2 rounded-full">
                                    <Text className="text-sm text-green-700 font-medium">✓ Reviewed</Text>
                                </View>
                            )}
                            <TouchableOpacity
                                className="bg-orange-100 px-4 py-2 rounded-full"
                                activeOpacity={0.8}
                                onPress={handleReorder}
                            >
                                <Text className="text-sm text-orange-600 font-medium">Order Again</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {status === "Cancelled" && (
                        <View className="bg-red-50 px-4 py-2 rounded-full">
                            <Text className="text-sm text-red-600 font-medium">Order Cancelled</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
