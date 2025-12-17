// app/(tabs)/favorites/index.tsx
import { bestSeller } from "@/assets/images/index";
import { FavoriteItem } from "@/components/common/favourites/FavoriteItem";
import Header from "@/components/common/Header";
import { Heart } from "lucide-react-native";
import React, { useState } from "react";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = {
    id: number;
    name: string;
    price: number;
    image: ImageSourcePropType;
    liked: boolean;
};

const initialFavorites: Item[] = [
    { id: 1, name: "Chicken Curry", price: 18.0, image: bestSeller.BS1, liked: false },
    { id: 2, name: "Chicken Burger", price: 12.0, image: bestSeller.BS2, liked: true },
    { id: 3, name: "Broccoli Lasagna", price: 15.0, image: bestSeller.BS3, liked: true },
    { id: 4, name: "Mexican Appetizer", price: 10.0, image: bestSeller.BS4, liked: false },
    { id: 5, name: "Honey Glazed Wings", price: 14.0, image: bestSeller.BS1, liked: true },
    { id: 6, name: "Milkshake Trio", price: 18.0, image: bestSeller.BS2, liked: true },
    { id: 7, name: "Spicy Ramen", price: 16.0, image: bestSeller.BS4, liked: true },
    { id: 8, name: "Chocolate Cake", price: 8.0, image: bestSeller.BS3, liked: false },
];

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState(initialFavorites);

    const handleToggleLike = (id: number) => {
        setFavorites((prev) => prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)));

        // BACKEND CALL (khi có backend)
        // POST /user/favorites/toggle → { productId: id }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Favorites" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                <Text className="text-xl font-medium text-orange-600 text-center mb-6">
                    {"It's time to buy your favorite dish."}
                </Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
                    <View className="flex-row flex-wrap justify-between">
                        {favorites.map((item) => (
                            <FavoriteItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                image={item.image}
                                liked={item.liked}
                                onToggleLike={handleToggleLike}
                            />
                        ))}
                    </View>

                    {/* Empty state */}
                    {favorites.length === 0 && (
                        <View className="items-center py-20">
                            <Heart size={80} color="#E95322" />
                            <Text className="text-xl font-medium text-gray-600 mt-6">No favorite dishes yet</Text>
                            <Text className="text-gray-500 text-center mt-2 px-8">
                                Explore and tap the heart to save your favorites!
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default FavoritesScreen;
