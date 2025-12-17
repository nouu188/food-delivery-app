import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePaymentStore } from "@/store/usePaymentStore";

export default function AddCardScreen() {
    const router = useRouter();
    const { addCard } = usePaymentStore();

    const [name, setName] = React.useState("John Smith");
    const [number, setNumber] = React.useState("000 000 000 00");
    const [expiry, setExpiry] = React.useState("04/28");
    const [cvv, setCvv] = React.useState("0000");

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Add Card" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <View className="rounded-3xl overflow-hidden" style={{ backgroundColor: "#F9CF63" }}>
                    <View className="h-40" style={{ backgroundColor: "#E95322" }} />
                    <View className="absolute inset-0 p-6">
                        <Text className="text-white font-extrabold text-lg">000 000 000 00</Text>
                        <View className="flex-row justify-between mt-10">
                            <View>
                                <Text className="text-white/80 text-xs font-semibold">Card Holder Name</Text>
                                <Text className="text-white font-bold mt-1">{name}</Text>
                            </View>
                            <View>
                                <Text className="text-white/80 text-xs font-semibold">Expiry Date</Text>
                                <Text className="text-white font-bold mt-1">{expiry}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="mt-8">
                    <Text className="text-[#6B7280] font-semibold mb-3">Card holder name</Text>
                    <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                        <TextInput value={name} onChangeText={setName} style={{ color: "#070707" }} />
                    </View>

                    <Text className="text-[#6B7280] font-semibold mb-3 mt-6">Card Number</Text>
                    <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                        <TextInput value={number} onChangeText={setNumber} style={{ color: "#070707" }} />
                    </View>

                    <View className="flex-row mt-6">
                        <View className="flex-1 mr-3">
                            <Text className="text-[#6B7280] font-semibold mb-3">Expiry Date</Text>
                            <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                                <TextInput value={expiry} onChangeText={setExpiry} style={{ color: "#070707" }} />
                            </View>
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-[#6B7280] font-semibold mb-3">CVV</Text>
                            <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                                <TextInput value={cvv} onChangeText={setCvv} style={{ color: "#070707" }} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                            const digits = number.replace(/\D/g, "");
                            const last4 = digits.slice(-4) || "0000";
                            addCard({ label: "Card", last4 });
                            router.back();
                        }}
                        className="self-center mt-10 px-14 py-3 rounded-full"
                        style={{ backgroundColor: "#E95322" }}
                    >
                        <Text className="text-white font-semibold">Save Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
