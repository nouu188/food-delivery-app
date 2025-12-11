// components/favorites/FavoriteItem.tsx
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

type FavoriteItemProps = {
  id: number;
  name: string;
  price: number;
  image: ImageSourcePropType;
  liked: boolean;
  onToggleLike: (id: number) => void;
};

export const FavoriteItem = ({
  id,
  name,
  price,
  image,
  liked,
  onToggleLike,
}: FavoriteItemProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="w-[48%] mb-7 relative"
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${id}`)}
    >
      {/* Ảnh món */}
      <View className="relative">
        <Image
          source={image} 
          className="w-full h-36 rounded-2xl"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleLike(id);
          }}
          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md"
        >
          <Heart
            size={22}
            color="#E95322"
            fill={liked ? "#E95322" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Thông tin */}
      <View className="mt-3">
        <Text
          className="font-bold text-sm text-orange-600 leading-5"
          numberOfLines={2}
        >
          {name}
        </Text>
        <Text className="text-orange-600 font-bold text-base mt-1">
          ${price.toFixed(2)}
        </Text>
        <Text className="text-gray-500 text-xs mt-1 leading-4" numberOfLines={2}>
          Lorem ipsum dolor sit amet, consectetur...
        </Text>
      </View>
    </TouchableOpacity>
  );
};