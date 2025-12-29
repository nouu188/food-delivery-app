import { useCartStore } from "@/store/useCartStore";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import { Clock, Package, Navigation, Star, ShoppingBag, CheckCircle, XCircle, Calendar } from "lucide-react-native";
import { useToastStore } from "@/store/useToastStore";
import { confirm } from "@/utils/confirm";

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
    orderStatus?: string;
};

const STATUS_COLORS = {
    PENDING: { bg: "#FFF5D6", text: "#E95322", icon: Clock },
    CONFIRMED: { bg: "#E0F2FE", text: "#0284C7", icon: CheckCircle },
    PREPARING: { bg: "#FEF3C7", text: "#D97706", icon: Clock },
    READY_FOR_PICKUP: { bg: "#DBEAFE", text: "#2563EB", icon: Package },
    PICKED_UP: { bg: "#E0E7FF", text: "#6366F1", icon: Navigation },
    ON_THE_WAY: { bg: "#E0E7FF", text: "#6366F1", icon: Navigation },
    DELIVERED: { bg: "#D1FAE5", text: "#059669", icon: CheckCircle },
    COMPLETED: { bg: "#D1FAE5", text: "#059669", icon: CheckCircle },
    CANCELLED: { bg: "#FEE2E2", text: "#DC2626", icon: XCircle },
    FAILED: { bg: "#FEE2E2", text: "#DC2626", icon: XCircle },
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
    orderStatus,
}: Props) {
    const showToast = useToastStore((s) => s.show);

    const handleViewDetails = () => {
        if (!id || id.trim() === "") {
            showToast({ type: "error", title: "Error", message: "Invalid order ID" });
            return;
        }
        router.push(`/orders/${id}`);
    };

    const handleLeaveReview = (e: any) => {
        e.stopPropagation();
        if (!id || id.trim() === "") {
            showToast({ type: "error", title: "Error", message: "Invalid order ID" });
            return;
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            showToast({ type: "error", title: "Error", message: "Invalid order format. Please try again." });
            console.error("Invalid order ID format:", id);
            return;
        }

        if (hasReview) {
            confirm({
                title: "Already Reviewed",
                message: "You have already reviewed this order.",
                confirmText: "View Details",
                cancelText: "OK",
            }).then((ok) => {
                if (ok) router.push(`/orders/${id}`);
            });
            return;
        }

        router.push(`/review/${id}`);
    };

    const handleCancelOrder = (e: any) => {
        e.stopPropagation();
        if (!id || id.trim() === "") {
            showToast({ type: "error", title: "Error", message: "Invalid order ID" });
            return;
        }
        router.push(`/cancel-order/${id}`);
    };

    const handleTrackDriver = (e: any) => {
        e.stopPropagation();
        if (!id || id.trim() === "") {
            showToast({ type: "error", title: "Error", message: "Invalid order ID" });
            return;
        }
        router.push(`/live-tracking/${id}`);
    };

    const handleReorder = (e: any) => {
        e.stopPropagation();
        if (!id || id.trim() === "") {
            showToast({ type: "error", title: "Error", message: "Invalid order ID" });
            return;
        }
        router.push(`/orders/${id}`);
    };

    const getStatusConfig = (status: string) => {
        const upperStatus = status.toUpperCase().replace(/ /g, "_");
        return STATUS_COLORS[upperStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.PENDING;
    };

    const statusConfig = orderStatus ? getStatusConfig(orderStatus) : null;
    const StatusIcon = statusConfig?.icon || Clock;

    return (
        <TouchableOpacity
            onPress={handleViewDetails}
            className="bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100"
            activeOpacity={0.9}
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            <View className="flex-row p-4">
                <View className="relative">
                    {image ? (
                        <Image source={image} className="w-24 h-24 rounded-xl" resizeMode="cover" />
                    ) : (
                        <View className="w-24 h-24 rounded-xl bg-gray-200 items-center justify-center">
                            <ShoppingBag size={32} color="#9CA3AF" />
                        </View>
                    )}
                    <View className="absolute -top-2 -right-2 bg-[#E95322] rounded-full px-2 py-1">
                        <Text className="text-white text-xs font-bold">{itemsCount}</Text>
                    </View>
                </View>

                <View className="flex-1 ml-4">
                    <View className="flex-row items-start justify-between mb-1">
                        <Text className="font-bold text-base text-[#070707] flex-1" numberOfLines={1}>
                            {name}
                        </Text>
                    </View>

                    {statusConfig && (
                        <View
                            className="flex-row items-center self-start px-2.5 py-1 rounded-full mb-2"
                            style={{ backgroundColor: statusConfig.bg }}
                        >
                            <StatusIcon size={12} color={statusConfig.text} />
                            <Text className="text-xs font-semibold ml-1" style={{ color: statusConfig.text }}>
                                {orderStatus?.replace(/_/g, " ")}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row items-center mb-1">
                        <Calendar size={14} color="#6B7280" />
                        <Text className="text-xs text-[#6B7280] ml-1.5">{date}</Text>
                    </View>

                    <Text className="text-xl font-bold text-[#E95322] mt-1">{price}</Text>
                </View>
            </View>

            <View className="px-4 pb-4 flex-row gap-2 flex-wrap">
                {status === "Active" && (
                    <>
                        <TouchableOpacity
                            className="bg-[#E95322] px-4 py-2.5 rounded-full flex-row items-center"
                            activeOpacity={0.8}
                            onPress={handleTrackDriver}
                        >
                            <Navigation size={16} color="#FFFFFF" />
                            <Text className="text-sm text-white font-semibold ml-1.5">Track Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="border border-red-400 px-4 py-2.5 rounded-full"
                            activeOpacity={0.8}
                            onPress={handleCancelOrder}
                        >
                            <Text className="text-sm text-red-600 font-semibold">Cancel</Text>
                        </TouchableOpacity>
                    </>
                )}

                {status === "Completed" && (
                    <>
                        {!hasReview && (
                            <TouchableOpacity
                                className="bg-[#F4BA1B] px-4 py-2.5 rounded-full flex-row items-center"
                                activeOpacity={0.8}
                                onPress={handleLeaveReview}
                            >
                                <Star size={16} color="#FFFFFF" />
                                <Text className="text-sm text-white font-semibold ml-1.5">Review</Text>
                            </TouchableOpacity>
                        )}
                        {hasReview && (
                            <View className="bg-green-100 px-4 py-2.5 rounded-full flex-row items-center">
                                <CheckCircle size={16} color="#059669" />
                                <Text className="text-sm text-green-700 font-semibold ml-1.5">Reviewed</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            className="bg-[#E95322] px-4 py-2.5 rounded-full flex-row items-center"
                            activeOpacity={0.8}
                            onPress={handleReorder}
                        >
                            <ShoppingBag size={16} color="#FFFFFF" />
                            <Text className="text-sm text-white font-semibold ml-1.5">Order Again</Text>
                        </TouchableOpacity>
                    </>
                )}

                {status === "Cancelled" && (
                    <>
                        <View className="bg-red-50 px-4 py-2.5 rounded-full flex-row items-center">
                            <XCircle size={16} color="#DC2626" />
                            <Text className="text-sm text-red-600 font-semibold ml-1.5">Order Cancelled</Text>
                        </View>
                        <TouchableOpacity
                            className="border border-[#E95322] px-4 py-2.5 rounded-full flex-row items-center"
                            activeOpacity={0.8}
                            onPress={handleReorder}
                        >
                            <ShoppingBag size={16} color="#E95322" />
                            <Text className="text-sm text-[#E95322] font-semibold ml-1.5">Order Again</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}
