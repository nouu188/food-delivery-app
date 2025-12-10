// app/product/[id].tsx
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-3xl font-bold">Product ID: {id}</Text>
        <Text className="mt-6 text-lg">Chi tiết món ăn sẽ được làm sau...</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;