import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAddressStore } from "@/store/useAddressStore";

export default function AddNewAddressScreen() {
    const router = useRouter();
    const { addAddress } = useAddressStore();

    const [label, setLabel] = React.useState("Anna House");
    const [address, setAddress] = React.useState("778 Locust View Drive\nOakland, CA");

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Add New Address" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-10">
                <View className="items-center">
                    <Feather name="home" size={60} color="#E95322" />

                    <View className="w-full mt-10">
                        <Text className="text-[#6B7280] font-semibold mb-3">Name</Text>
                        <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput value={label} onChangeText={setLabel} style={{ color: "#070707" }} />
                        </View>

                        <Text className="text-[#6B7280] font-semibold mb-3 mt-6">Address</Text>
                        <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                style={{ minHeight: 52, color: "#070707" }}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                addAddress({ label, address });
                                router.back();
                            }}
                            className="self-center mt-12 px-14 py-3 rounded-full"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Text className="text-white font-semibold">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
