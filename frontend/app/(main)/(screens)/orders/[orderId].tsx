import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Clipboard,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
    MapPin,
    CreditCard,
    Wallet,
    DollarSign,
    Gift,
    Phone,
    Clock,
    Copy,
    Package,
    Truck,
    Navigation,
    Star,
} from "lucide-react-native";
import orderService from "@/services/api/order.service";
import { useCartStore } from "@/store/useCartStore";
import { Order, OrderStatus, CancelledBy, PaymentMethod } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";
import { useToastStore } from "@/store/useToastStore";
import { confirm } from "@/utils/confirm";

const STATUS_STEPS = [
    { status: OrderStatus.PENDING, label: "Order Placed", icon: "check-circle" },
    { status: OrderStatus.CONFIRMED, label: "Confirmed", icon: "check-circle" },
    { status: OrderStatus.PREPARING, label: "Preparing", icon: "clock" },
    { status: OrderStatus.READY_FOR_PICKUP, label: "Ready", icon: "package" },
    { status: OrderStatus.PICKED_UP, label: "Picked Up", icon: "truck" },
    { status: OrderStatus.ON_THE_WAY, label: "On The Way", icon: "navigation" },
    { status: OrderStatus.DELIVERED, label: "Delivered", icon: "check-circle" },
];

const PAYMENT_ICONS = {
    [PaymentMethod.COD]: DollarSign,
    [PaymentMethod.WALLET]: Wallet,
    [PaymentMethod.CARD]: CreditCard,
    [PaymentMethod.MOMO]: Wallet,
    [PaymentMethod.VNPAY]: CreditCard,
};

export default function OrderDetails() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const router = useRouter();
    const { fetchCart } = useCartStore();
    const showToast = useToastStore((s) => s.show);

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
            showErrorAlert(error, "Failed to Load Order");
            router.back();
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchCart();
    }, [orderId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const copyOrderNumber = () => {
        if (order) {
            Clipboard.setString(order.order_number || order.id);
            showToast({ type: "success", title: "Copied", message: "Order number copied to clipboard." });
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        const ok = await confirm({
            title: "Cancel Order",
            message: "Are you sure you want to cancel this order?",
            confirmText: "Yes, Cancel",
            cancelText: "No",
            destructive: true,
        });

        if (!ok) return;

        setIsCancelling(true);
        try {
            await orderService.cancelOrder(order.id, {
                cancellation_reason: "Cancelled by customer",
                cancelled_by: CancelledBy.CUSTOMER,
            });
            showToast({ type: "success", title: "Success", message: "Order cancelled successfully." });
            fetchOrder();
        } catch (error) {
            showErrorAlert(error, "Failed to Cancel Order");
        } finally {
            setIsCancelling(false);
        }
    };

    const handleReorder = async () => {
        if (!order) return;

        const { cart, clearCart: clearCartStore } = useCartStore.getState();

        if (
            cart &&
            cart.restaurant_id &&
            cart.restaurant_id !== order.restaurant_id &&
            cart.items &&
            cart.items.length > 0
        ) {
            const ok = await confirm({
                title: "Clear Cart?",
                message: `Your cart contains items from ${
                    cart.restaurant_name || "another restaurant"
                }. Clear your cart to reorder from this restaurant?`,
                confirmText: "Clear & Reorder",
                cancelText: "Cancel",
                destructive: true,
            });

            if (!ok) return;

            try {
                await clearCartStore();
                await proceedWithReorder();
            } catch (error) {
                showErrorAlert(error, "Failed to Clear Cart");
            }
            return;
        }

        await proceedWithReorder();
    };

    const proceedWithReorder = async () => {
        setIsReordering(true);
        try {
            await orderService.reorder(order!.id);
            await fetchCart();
            const goCart = await confirm({
                title: "Items Added to Cart",
                message: "Order items have been added to your cart.",
                confirmText: "View Cart",
                cancelText: "OK",
            });

            if (goCart) router.push("/cart");
        } catch (error) {
            showErrorAlert(error, "Failed to Reorder");
        } finally {
            setIsReordering(false);
        }
    };

    const canCancelOrder = (status: OrderStatus) => {
        return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(status);
    };

    const canTrackOrder = (status: OrderStatus) => {
        return [
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY_FOR_PICKUP,
            OrderStatus.PICKED_UP,
            OrderStatus.ON_THE_WAY,
        ].includes(status);
    };

    const canReviewOrder = (status: OrderStatus) => {
        return [OrderStatus.DELIVERED, OrderStatus.COMPLETED].includes(status);
    };

    const getCurrentStepIndex = (status: OrderStatus): number => {
        if (status === OrderStatus.CANCELLED || status === OrderStatus.FAILED) return -1;
        const index = STATUS_STEPS.findIndex((step) => step.status === status);
        return index !== -1 ? index : 0;
    };

    const isStepCompleted = (stepIndex: number, currentIndex: number): boolean => {
        return stepIndex <= currentIndex;
    };

    const getPaymentMethodLabel = (method: PaymentMethod): string => {
        const labels = {
            [PaymentMethod.COD]: "Cash on Delivery",
            [PaymentMethod.WALLET]: "Wallet",
            [PaymentMethod.CARD]: "Credit/Debit Card",
            [PaymentMethod.MOMO]: "MoMo",
            [PaymentMethod.VNPAY]: "VNPay",
        };
        return labels[method] || method;
    };

    const renderSelectedOptions = (options: any) => {
        if (!options || typeof options !== "object") return null;

        try {
            const optionsArray = Array.isArray(options) ? options : [];
            if (optionsArray.length === 0) return null;

            return (
                <View className="mt-2 pl-2 border-l-2 border-gray-200">
                    {optionsArray.map((opt: any, idx: number) => (
                        <Text key={idx} className="text-xs text-gray-600 mb-1">
                            + {opt.name} {opt.price_modifier > 0 ? `(+$${opt.price_modifier})` : ""}
                        </Text>
                    ))}
                </View>
            );
        } catch (e) {
            return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Order Details" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-[#6B7280] mt-4">Loading order details...</Text>
                    </View>
                ) : !order ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-[#6B7280]">Order not found</Text>
                    </View>
                ) : (
                    <>
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
                            <View className="mb-6">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-2xl font-bold text-[#070707]">
                                        Order #{order.order_number || order.id.substring(0, 8)}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={copyOrderNumber}
                                        className="p-2 bg-[#FFF5D6] rounded-full"
                                        activeOpacity={0.7}
                                    >
                                        <Copy size={16} color="#E95322" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-sm text-[#6B7280]">
                                    {formatDate(order.created_at)} at {formatTime(order.created_at)}
                                </Text>
                            </View>

                            {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.FAILED && (
                                <View className="bg-[#FFF5D6] rounded-2xl p-4 mb-6">
                                    <Text className="text-[#070707] font-bold text-base mb-4">Order Status</Text>
                                    <View className="pl-2">
                                        {STATUS_STEPS.map((step, index) => {
                                            const currentIndex = getCurrentStepIndex(order.status);
                                            const isCompleted = isStepCompleted(index, currentIndex);
                                            const isActive = index === currentIndex;

                                            return (
                                                <View key={step.status} className="flex-row mb-4 last:mb-0">
                                                    <View className="items-center mr-4">
                                                        <View
                                                            className="w-9 h-9 rounded-full items-center justify-center"
                                                            style={{
                                                                backgroundColor: isCompleted ? "#E95322" : "#E5E7EB",
                                                            }}
                                                        >
                                                            <Feather
                                                                name={step.icon as any}
                                                                size={18}
                                                                color={isCompleted ? "#FFFFFF" : "#9CA3AF"}
                                                            />
                                                        </View>
                                                        {index < STATUS_STEPS.length - 1 && (
                                                            <View
                                                                className="w-0.5 h-10 mt-1"
                                                                style={{
                                                                    backgroundColor: isCompleted
                                                                        ? "#E95322"
                                                                        : "#E5E7EB",
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                    <View className="flex-1 pt-1">
                                                        <Text
                                                            className={`font-semibold text-sm ${
                                                                isActive
                                                                    ? "text-[#E95322]"
                                                                    : isCompleted
                                                                    ? "text-[#070707]"
                                                                    : "text-[#9CA3AF]"
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </Text>
                                                        {isActive && (
                                                            <Text className="text-[#6B7280] text-xs mt-0.5">
                                                                In Progress...
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}

                            {(order.status === OrderStatus.CANCELLED || order.status === OrderStatus.FAILED) && (
                                <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                                    <Text className="text-red-800 font-bold text-base mb-1">
                                        Order {order.status === OrderStatus.CANCELLED ? "Cancelled" : "Failed"}
                                    </Text>
                                    {order.cancellation_reason && (
                                        <Text className="text-red-700 text-sm">
                                            Reason: {order.cancellation_reason}
                                        </Text>
                                    )}
                                    {order.cancelled_by && (
                                        <Text className="text-red-600 text-xs mt-1">
                                            Cancelled by: {order.cancelled_by.toLowerCase()}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {order.estimated_delivery && canTrackOrder(order.status) && (
                                <View className="bg-[#FFE3D6] rounded-2xl p-4 mb-6">
                                    <View className="flex-row items-center">
                                        <Clock size={20} color="#E95322" />
                                        <Text className="text-[#070707] font-semibold ml-2">Estimated Delivery</Text>
                                    </View>
                                    <Text className="text-[#E95322] font-bold text-xl mt-2">
                                        {formatTime(order.estimated_delivery)}
                                    </Text>
                                </View>
                            )}

                            {order.restaurant_name && (
                                <View
                                    className="bg-white border border-gray-200 rounded-2xl p-4 mb-6"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOpacity: 0.05,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowRadius: 4,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1">
                                            <Text className="text-[#6B7280] text-xs font-medium mb-1">RESTAURANT</Text>
                                            <Text className="text-[#070707] font-bold text-lg">
                                                {order.restaurant_name}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => router.push(`/restaurant/${order.restaurant_id}`)}
                                            className="bg-[#E95322] px-4 py-2 rounded-full"
                                            activeOpacity={0.9}
                                        >
                                            <Text className="text-white font-semibold text-sm">View</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {order.delivery_address && (
                                <View
                                    className="bg-white border border-gray-200 rounded-2xl p-4 mb-6"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOpacity: 0.05,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowRadius: 4,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="flex-row items-start">
                                        <MapPin size={20} color="#E95322" className="mt-0.5" />
                                        <View className="flex-1 ml-3">
                                            <Text className="text-[#6B7280] text-xs font-medium">DELIVERY ADDRESS</Text>
                                            <Text className="text-[#070707] font-medium text-base">
                                                {typeof order.delivery_address === "object"
                                                    ? `${order.delivery_address.address_line}, ${order.delivery_address.ward}, ${order.delivery_address.district}, ${order.delivery_address.city}`
                                                    : order.delivery_address}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View
                                className="bg-white border border-gray-200 rounded-2xl p-4 mb-6"
                                style={{
                                    shadowColor: "#000",
                                    shadowOpacity: 0.05,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowRadius: 4,
                                    elevation: 2,
                                }}
                            >
                                <View className="flex-row items-center">
                                    {(() => {
                                        const PaymentIcon = PAYMENT_ICONS[order.payment_method] || CreditCard;
                                        return <PaymentIcon size={20} color="#E95322" />;
                                    })()}
                                    <View className="flex-1 ml-3">
                                        <Text className="text-[#6B7280] text-xs font-medium mb-1">PAYMENT METHOD</Text>
                                        <Text className="text-[#070707] font-medium text-base">
                                            {getPaymentMethodLabel(order.payment_method)}
                                        </Text>
                                    </View>
                                </View>

                                {order.voucher_code && (
                                    <View className="flex-row items-center pt-3 border-t border-gray-100">
                                        <Gift size={20} color="#10B981" />
                                        <View className="flex-1 ml-3">
                                            <Text className="text-[#6B7280] text-xs font-medium mb-1">
                                                VOUCHER APPLIED
                                            </Text>
                                            <Text className="text-[#10B981] font-bold text-base">
                                                {order.voucher_code}
                                            </Text>
                                        </View>
                                        {order.discount_amount > 0 && (
                                            <Text className="text-[#10B981] font-bold text-lg">
                                                -${order.discount_amount}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            {order.special_instructions && (
                                <View className="bg-[#FFF5D6] rounded-2xl p-4 mb-6">
                                    <Text className="text-[#070707] font-semibold text-sm mb-2">
                                        Special Instructions
                                    </Text>
                                    <Text className="text-[#6B7280] text-sm">{order.special_instructions}</Text>
                                </View>
                            )}

                            <View className="mb-6">
                                <Text className="text-[#070707] font-bold text-lg mb-4">Order Items</Text>
                                {order.items &&
                                    Array.isArray(order.items) &&
                                    order.items.map((item, index) => (
                                        <View
                                            key={index}
                                            className="bg-white border border-gray-100 rounded-2xl p-4 mb-3"
                                            style={{
                                                shadowColor: "#000",
                                                shadowOpacity: 0.05,
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowRadius: 4,
                                                elevation: 2,
                                            }}
                                        >
                                            <View className="flex-row">
                                                {item.menu_item?.image_url ? (
                                                    <Image
                                                        source={{ uri: item.menu_item.image_url }}
                                                        className="w-24 h-24 rounded-xl"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View className="w-24 h-24 rounded-xl bg-gray-200 items-center justify-center">
                                                        <Package size={32} color="#9CA3AF" />
                                                    </View>
                                                )}
                                                <View className="flex-1 ml-4">
                                                    <Text
                                                        className="text-base font-bold text-[#070707]"
                                                        numberOfLines={2}
                                                    >
                                                        {item.menu_item?.name || item.item_name}
                                                    </Text>
                                                    <Text className="text-sm text-[#6B7280] mt-1">
                                                        ${item.unit_price} × {item.quantity}
                                                    </Text>
                                                    {renderSelectedOptions(item.selected_options)}
                                                    {item.special_instructions && (
                                                        <View className="mt-2 bg-[#FFF5D6] rounded-lg p-2">
                                                            <Text className="text-xs text-[#6B7280]">
                                                                Note: {item.special_instructions}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    <Text className="text-base font-bold text-[#E95322] mt-2">
                                                        ${item.total_price}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                            </View>

                            <View className="bg-[#FFF5D6] rounded-2xl p-5 mb-6">
                                <Text className="text-[#070707] font-bold text-lg mb-4">Price Details</Text>

                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-base text-[#6B7280]">Subtotal</Text>
                                    <Text className="text-base font-semibold text-[#070707]">${order.subtotal}</Text>
                                </View>

                                {order.tax_amount > 0 && (
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-base text-[#6B7280]">Tax and Fees</Text>
                                        <Text className="text-base font-semibold text-[#070707]">
                                            ${order.tax_amount}
                                        </Text>
                                    </View>
                                )}

                                {order.delivery_fee > 0 && (
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row items-center">
                                            <Truck size={16} color="#6B7280" />
                                            <Text className="text-base text-[#6B7280] ml-2">Delivery Fee</Text>
                                        </View>
                                        <Text className="text-base font-semibold text-[#070707]">
                                            ${order.delivery_fee}
                                        </Text>
                                    </View>
                                )}

                                {order.discount_amount > 0 && (
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row items-center">
                                            <Gift size={16} color="#10B981" />
                                            <Text className="text-base text-[#10B981] ml-2">Discount</Text>
                                        </View>
                                        <Text className="text-base font-bold text-[#10B981]">
                                            -${order.discount_amount}
                                        </Text>
                                    </View>
                                )}

                                <View className="border-t border-orange-200 pt-4 mt-2">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-xl font-bold text-[#070707]">Total</Text>
                                        <Text className="text-2xl font-bold text-[#E95322]">${order.total_amount}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="mb-24">
                                {canTrackOrder(order.status) && (
                                    <TouchableOpacity
                                        className="bg-[#E95322] py-4 rounded-full mb-3 flex-row items-center justify-center"
                                        activeOpacity={0.9}
                                        onPress={() => router.push(`/live-tracking/${order.id}`)}
                                    >
                                        <Navigation size={20} color="#FFFFFF" />
                                        <Text className="text-white text-center font-semibold text-base ml-2">
                                            Track Order
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {canCancelOrder(order.status) && (
                                    <TouchableOpacity
                                        className="bg-red-600 py-4 rounded-full mb-3"
                                        activeOpacity={0.9}
                                        onPress={handleCancelOrder}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text className="text-white text-center font-semibold text-base">
                                                Cancel Order
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                )}

                                {canReviewOrder(order.status) && (
                                    <TouchableOpacity
                                        className="bg-[#F4BA1B] py-4 rounded-full mb-3 flex-row items-center justify-center"
                                        activeOpacity={0.9}
                                        onPress={() => router.push(`/review/${order.id}`)}
                                    >
                                        <Star size={20} color="#FFFFFF" />
                                        <Text className="text-white text-center font-semibold text-base ml-2">
                                            Write a Review
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    className="bg-[#E95322] py-4 rounded-full mb-3"
                                    activeOpacity={0.9}
                                    onPress={handleReorder}
                                    disabled={isReordering}
                                >
                                    {isReordering ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white text-center font-semibold text-base">
                                            Order Again
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="border-2 border-[#E95322] py-4 rounded-full flex-row items-center justify-center"
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        showToast({
                                            type: "info",
                                            title: "Support",
                                            message: "Support feature coming soon!",
                                        })
                                    }
                                >
                                    <Phone size={20} color="#E95322" />
                                    <Text className="text-[#E95322] text-center font-semibold text-base ml-2">
                                        Contact Support
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
