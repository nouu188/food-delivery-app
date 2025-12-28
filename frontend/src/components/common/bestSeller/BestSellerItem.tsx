import Snack from '@/assets/icons/SnacksIcon.svg';
import { useRouter } from 'expo-router';
import { Heart, Star } from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { formatPrice, formatRating } from '@/utils/format';

type Props = {
    id: string;
    name: string;
    price: string;
    rating: string;
    image: ImageSourcePropType | null;
    liked: boolean;
    onToggleLike: (id: string) => void;
    onAddToCart?: (id: string) => void;
    description?: string | null;
    isOpen?: boolean;
};

export const BestSellerItem = ({ id, name, price, rating, image, liked, onToggleLike, onAddToCart, description, isOpen }: Props) => {
    const router = useRouter();
    return (
        <TouchableOpacity className="w-[48%] mb-5" activeOpacity={0.9} onPress={() => router.push({
            pathname: "/restaurant/[id]",
            params: { id },
        })}>
            <View>
                <View className="bg-white rounded-3xl overflow-hidden shadow-lg h-72">
                    <View className="relative">
                        {image && <Image source={image} className="w-full h-40" resizeMode="cover" />}
                        {!image && (
                            <View className="w-full h-40 bg-gray-200 items-center justify-center">
                                <Snack width={48} height={48} color="#E5E7EB" />
                            </View>
                        )}

                        {isOpen !== undefined && (
                            <View className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-full ${
                                isOpen ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                <Text className="text-white text-xs font-bold">
                                    {isOpen ? 'OPEN' : 'CLOSED'}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onToggleLike(id);
                            }}
                            className="absolute top-2.5 right-2.5 bg-white rounded-full p-1.5 shadow-md"
                        >
                            <Heart
                                size={22}
                                color="#E95322"
                                fill={liked ? '#E95322' : 'transparent'}
                                strokeWidth={2.5}
                            />
                        </TouchableOpacity>

                        <View className="absolute bottom-2.5 right-2.5 bg-orange-600 px-3 py-1 rounded-full shadow-xl">
                            <Text className="text-white text-sm font-bold">${formatPrice(price)}</Text>
                        </View>
                    </View>

                    <View className="flex-1 px-3 pt-3">
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-[15px] font-bold text-gray-900 flex-1 pr-3"
                                numberOfLines={2}
                                style={{ height: 40 }}
                            >
                                {name}
                            </Text>

                            <View className="flex-row items-center bg-orange-600 px-2.5 py-1 rounded-full">
                                <Text className="text-white font-bold text-xs mr-0.5">{formatRating(rating)}</Text>
                                <Star size={13} color="#FFD700" fill="#FFD700" />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-xs text-gray-500 leading-4" numberOfLines={2}>
                                {description || 'Delicious food from this restaurant'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};