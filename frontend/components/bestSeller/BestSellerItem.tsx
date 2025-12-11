// components/bestSeller/BestSellerItem.tsx
import Snack from '@/svgs/SVGBestSeller';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart, Star } from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: ImageSourcePropType;
    liked: boolean;
    onToggleLike: (id: number) => void;
    onAddToCart?: (id: number) => void;
};

export const BestSellerItem = ({ id, name, price, rating, image, liked, onToggleLike, onAddToCart }: Props) => {
    const router = useRouter();
    return (
        <TouchableOpacity className="w-[48%] mb-5" activeOpacity={0.9} onPress={() => router.push(`/food/${id}`)}>
            <View>
                {/* Card siêu gọn */}
                <View className="bg-white rounded-3xl overflow-hidden shadow-lg h-72">
                    {/* Ảnh */}
                    <View className="relative">
                        <Image source={image} className="w-full h-40" resizeMode="cover" />

                        {/* Icon Snack */}
                        <View className="absolute top-2.5 left-2.5 bg-white rounded-full p-1.5 shadow-md">
                            <Snack width={24} height={24} />
                        </View>

                        {/* Heart */}
                        <TouchableOpacity
                            onPress={() => onToggleLike(id)}
                            className="absolute top-2.5 right-2.5 bg-white rounded-full p-1.5 shadow-md"
                        >
                            <Heart
                                size={22}
                                color="#E95322"
                                fill={liked ? '#E95322' : 'transparent'}
                                strokeWidth={2.5}
                            />
                        </TouchableOpacity>

                        {/* Price nhỏ xinh */}
                        <View className="absolute bottom-2.5 right-2.5 bg-orange-600 px-3 py-1 rounded-full shadow-xl">
                            <Text className="text-white text-sm font-bold">${price.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Nội dung dưới */}
                    <View className="flex-1 px-3 pt-3">
                        {/* Dòng 1: Tên món (trái) + Rating (phải) */}
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-[15px] font-bold text-gray-900 flex-1 pr-3"
                                numberOfLines={2}
                                style={{ height: 40 }}
                            >
                                {name}
                            </Text>

                            <View className="flex-row items-center bg-orange-600 px-2.5 py-1 rounded-full">
                                <Text className="text-white font-bold text-xs mr-0.5">{rating.toFixed(1)}</Text>
                                <Star size={13} color="#FFD700" fill="#FFD700" />
                            </View>
                        </View>

                        {/* Dòng 2: Mô tả (trái) + Giỏ hàng (phải) – luôn sát đáy */}
                        <View className="flex-row justify-between items-center mt-4">
                            <Text className="text-xs text-gray-500 leading-4 flex-1 pr-3" numberOfLines={2}>
                                Lorem ipsum dolor sit amet...
                            </Text>

                            <TouchableOpacity
                                onPress={() => onAddToCart?.(id)}
                                className="bg-orange-100 p-2 rounded-full"
                            >
                                <ShoppingCart size={18} color="#E95322" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
