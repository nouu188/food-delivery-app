import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAddressStore } from "@/store/useAddressStore";
import { showErrorAlert } from "@/utils/error-handler";

export default function AddNewAddressScreen() {
    const router = useRouter();
    const { addAddress } = useAddressStore();

    const [label, setLabel] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [ward, setWard] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        // Validation
        if (!label.trim()) {
            Alert.alert('Validation Error', 'Please enter a label for this address');
            return;
        }
        if (!addressLine.trim()) {
            Alert.alert('Validation Error', 'Please enter the address line');
            return;
        }
        if (!ward.trim()) {
            Alert.alert('Validation Error', 'Please enter the ward');
            return;
        }
        if (!district.trim()) {
            Alert.alert('Validation Error', 'Please enter the district');
            return;
        }
        if (!city.trim()) {
            Alert.alert('Validation Error', 'Please enter the city');
            return;
        }

        setIsSaving(true);
        try {
            await addAddress({
                label: label.trim(),
                address_line: addressLine.trim(),
                ward: ward.trim(), 
                district: district.trim(),
                city: city.trim(),
                latitude: 0, // TODO: Get from map picker
                longitude: 0, // TODO: Get from map picker
                is_default: isDefault,
            });
            Alert.alert('Success', 'Address added successfully');
            router.back();
        } catch (error) {
            showErrorAlert(error, 'Failed to Add Address');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Add New Address" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                    <View className="items-center mt-4">
                        <Feather name="map-pin" size={50} color="#E95322" />
                    </View>

                    <View className="w-full mt-8">
                        <Text className="text-[#6B7280] font-semibold mb-2">Label</Text>
                        <View className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={label}
                                onChangeText={setLabel}
                                placeholder="e.g. Home, Office, etc."
                                placeholderTextColor="#9CA3AF"
                                style={{ color: "#070707" }}
                            />
                        </View>

                        <Text className="text-[#6B7280] font-semibold mb-2">Address Line</Text>
                        <View className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={addressLine}
                                onChangeText={setAddressLine}
                                placeholder="Street address, apartment number, etc."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                style={{ minHeight: 60, color: "#070707" }}
                            />
                        </View>

                        <Text className="text-[#6B7280] font-semibold mb-2">Ward</Text>
                        <View className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={ward}
                                onChangeText={setWard}
                                placeholder="Enter ward"
                                placeholderTextColor="#9CA3AF"
                                style={{ color: "#070707" }}
                            />
                        </View>

                        <Text className="text-[#6B7280] font-semibold mb-2">District</Text>
                        <View className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={district}
                                onChangeText={setDistrict}
                                placeholder="Enter district"
                                placeholderTextColor="#9CA3AF"
                                style={{ color: "#070707" }}
                            />
                        </View>

                        <Text className="text-[#6B7280] font-semibold mb-2">City</Text>
                        <View className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={city}
                                onChangeText={setCity}
                                placeholder="Enter city"
                                placeholderTextColor="#9CA3AF"
                                style={{ color: "#070707" }}
                            />
                        </View>

                        <View className="flex-row items-center justify-between py-3">
                            <Text className="text-[#6B7280] font-semibold">Set as default address</Text>
                            <Switch
                                value={isDefault}
                                onValueChange={setIsDefault}
                                trackColor={{ false: '#D1D5DB', true: '#FFD8C7' }}
                                thumbColor={isDefault ? '#E95322' : '#F3F4F6'}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleSubmit}
                            disabled={isSaving}
                            className="self-center mt-8 px-14 py-4 rounded-full"
                            style={{ backgroundColor: isSaving ? "#9CA3AF" : "#E95322" }}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white font-semibold text-base">Save Address</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
