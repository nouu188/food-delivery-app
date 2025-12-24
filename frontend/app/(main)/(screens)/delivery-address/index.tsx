import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAddressStore } from "@/store/useAddressStore";
import { showErrorAlert } from "@/utils/error-handler";

export default function DeliveryAddressScreen() {
    const router = useRouter();
    const { addresses, selectedAddressId, setSelectedAddress, fetchAddresses, deleteAddress, isLoading } = useAddressStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchAddresses();
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleDelete = (addressId: string, addressLabel: string) => {
        Alert.alert(
            'Delete Address',
            `Are you sure you want to delete "${addressLabel}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAddress(addressId);
                        } catch (error) {
                            showErrorAlert(error, 'Failed to Delete Address');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Delivery Address" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                {isLoading && !isRefreshing ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading addresses...</Text>
                    </View>
                ) : !addresses || !Array.isArray(addresses) || addresses.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Feather name="map-pin" size={60} color="#E95322" />
                        <Text className="text-xl font-medium text-gray-600 mt-6">No addresses yet</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            Add your delivery address to continue
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => router.push("/delivery-address/add")}
                            className="mt-8 px-10 py-3 rounded-full bg-[#E95322]"
                        >
                            <Text className="text-white font-semibold">Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                tintColor="#E95322"
                            />
                        }
                    >
                        {addresses && Array.isArray(addresses) && addresses.map((a) => {
                            const active = a.id === selectedAddressId;
                            return (
                                <View key={a.id}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedAddress(a.id)}
                                        className="py-5 border-b"
                                        style={{ borderBottomColor: "#FFD8C7" }}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center flex-1">
                                                <Feather name="home" size={22} color="#E95322" />
                                                <View className="ml-4 flex-1">
                                                    <View className="flex-row items-center">
                                                        <Text className="font-semibold text-[#070707]">{a.label}</Text>
                                                        {a.is_default && (
                                                            <View className="ml-2 px-2 py-0.5 rounded bg-orange-100">
                                                                <Text className="text-[#E95322] text-xs font-medium">Default</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text className="text-[#6B7280] text-xs mt-1" numberOfLines={2}>
                                                        {a.address_line}, {a.ward}, {a.district}, {a.city}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="flex-row items-center">
                                                <TouchableOpacity
                                                    onPress={() => handleDelete(a.id, a.label)}
                                                    className="p-2 mr-2"
                                                >
                                                    <Feather name="trash-2" size={18} color="#EF4444" />
                                                </TouchableOpacity>
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
                                        </View>
                                    </TouchableOpacity>
                                </View>
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
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
