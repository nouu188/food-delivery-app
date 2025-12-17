import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAddressStore } from "@/store/useAddressStore";

export default function DeliveryAddressScreen() {
    const router = useRouter();
    const { addresses, selectedAddressId, selectAddress } = useAddressStore();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Delivery Address" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <View className="pb-32">
                    {addresses.map((a) => {
                        const active = a.id === selectedAddressId;
                        return (
                            <TouchableOpacity
                                key={a.id}
                                activeOpacity={0.8}
                                onPress={() => selectAddress(a.id)}
                                className="py-5 border-b"
                                style={{ borderBottomColor: "#FFD8C7" }}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <Feather name="home" size={22} color="#E95322" />
                                        <View className="ml-4 flex-1">
                                            <Text className="font-semibold text-[#070707]">{a.label}</Text>
                                            <Text className="text-[#6B7280] text-xs mt-1" numberOfLines={1}>
                                                {a.address}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        className="w-4 h-4 rounded-full items-center justify-center"
                                        style={{ borderWidth: 1.5, borderColor: "#E95322" }}
                                    >
                                        {active && (
                                            <View
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: "#E95322" }}
                                            />
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => router.push("/delivery-address/add")}
                        className="self-center mt-16 px-10 py-3 rounded-full"
                        style={{ backgroundColor: "#FFE3D6" }}
                    >
                        <Text className="text-[#E95322] font-semibold">Add New Address</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
