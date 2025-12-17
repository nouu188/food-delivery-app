// app/(tabs)/orders/history.tsx
import Header from "@/components/common/Header";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const dummyHistory = [
    {
        id: "0054752",
        date: "29 Nov, 06:20 pm",
        price: "$50.00",
        itemsCount: 2,
    },
    {
        id: "0028762",
        date: "10 Nov, 06:05 pm",
        price: "$50.00",
        itemsCount: 2,
    },
    {
        id: "0881990",
        date: "06 Oct, 08:30 pm",
        price: "$8.00",
        itemsCount: 1,
    },
];

export default function HistoryScreen() {
    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="History" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="pb-32">
                        {dummyHistory.map((order) => (
                            <TouchableOpacity
                                key={order.id}
                                onPress={() => router.push(`/orders/${order.id}`)}
                                className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="font-medium">Order No. {order.id}</Text>
                                    <Text className="text-sm text-gray-500 mt-1">{order.date}</Text>
                                    <Text className="text-sm text-green-600 mt-1">✓ Order delivered</Text>
                                </View>

                                <View className="items-end">
                                    <Text className="text-2xl font-bold text-red-600">{order.price}</Text>
                                    <Text className="text-sm text-gray-500">{order.itemsCount} items</Text>
                                    <TouchableOpacity className="bg-orange-100 px-5 py-2 rounded-full mt-3">
                                        <Text className="text-orange-600 text-sm font-medium">Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
