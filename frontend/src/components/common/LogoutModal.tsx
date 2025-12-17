import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type Props = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function LogoutModal({ visible, onCancel, onConfirm }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
                <Pressable className="absolute inset-0" onPress={onCancel} />

                <View className="bg-white rounded-3xl px-6 py-6" style={{ width: "86%" }}>
                    <Text className="text-center text-base font-semibold text-[#070707] mb-5">
                        Are you sure you want to log out?
                    </Text>

                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={onCancel}
                            activeOpacity={0.85}
                            className="px-8 py-3 rounded-full"
                            style={{ backgroundColor: "#FFE3D6" }}
                        >
                            <Text className="text-[#E95322] font-semibold">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            activeOpacity={0.85}
                            className="px-8 py-3 rounded-full"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Text className="text-white font-semibold">Yes, logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
