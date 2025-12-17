import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star } from "@tamagui/lucide-icons";
import { food } from "@/assets/images";

export default function ReviewScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [rating, setRating] = React.useState(4);
    const [comment, setComment] = React.useState("");

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Leave a Review" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
                <View className="items-center">
                    <Image source={food.BS2} className="w-40 h-32 rounded-2xl" resizeMode="cover" />
                    <Text className="mt-4 text-lg font-bold text-[#070707]">Chicken Curry</Text>
                    <Text className="mt-2 text-center text-[#6B7280] font-semibold">
                        We’d love to know what you{`\n`}think of your dish.
                    </Text>

                    <View className="flex-row mt-6">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const active = i + 1 <= rating;
                            return (
                                <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setRating(i + 1)}>
                                    <Star
                                        size={26}
                                        color="#E95322"
                                        fill={active ? "#E95322" : "transparent"}
                                        strokeWidth={2}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text className="mt-6 text-[#6B7280] font-semibold">Leave us your comment!</Text>

                    <View className="mt-4 w-full rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Write Review..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            style={{ minHeight: 70, color: "#070707" }}
                        />
                    </View>

                    <View className="flex-row mt-6 w-full justify-between">
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => router.back()}
                            className="px-10 py-3 rounded-full"
                            style={{ backgroundColor: "#FFE3D6" }}
                        >
                            <Text className="text-[#E95322] font-semibold">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => router.back()}
                            className="px-10 py-3 rounded-full"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Text className="text-white font-semibold">Submit</Text>
                        </TouchableOpacity>
                    </View>

                    {!!orderId && <Text className="mt-6 text-xs text-[#9CA3AF]">Order: {orderId}</Text>}
                </View>
            </View>
        </SafeAreaView>
    );
}
