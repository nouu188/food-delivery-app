// app/(tabs)/bestSeller/index.tsx
import { bestSeller } from '@/assets/images/index';
import { BestSellerItem } from '@/components/bestSeller/BestSellerItem';
import AuthHeader from '@/components/ui/AuthHeader';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Item = {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: any; // từ bestSeller.BS1, BS2,...
    liked: boolean;
};

const initialBestSellers: Item[] = [
    { id: 1, name: 'Sunny Bruschetta', price: 15.0, rating: 5.0, image: bestSeller.BS1, liked: false },
    { id: 2, name: 'Gourmet Grilled Skewers', price: 12.0, rating: 4.5, image: bestSeller.BS2, liked: true },
    { id: 3, name: 'Barbecue Tacos', price: 15.0, rating: 4.0, image: bestSeller.BS3, liked: false },
    { id: 4, name: 'Broccoli Lasagna', price: 12.0, rating: 3.5, image: bestSeller.BS4, liked: false },
    { id: 5, name: 'Creamy Frappuccino', price: 15.0, rating: 4.8, image: bestSeller.BS1, liked: true },
    { id: 6, name: 'Strawberry Cheesecake', price: 12.0, rating: 4.9, image: bestSeller.BS3, liked: false },
    // Thêm nếu muốn nhiều hơn...
];

const BestSellerScreen = () => {
    const [items, setItems] = useState(initialBestSellers);

    const handleToggleLike = (id: number) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)));
        // TODO: Gọi API backend ở đây
    };

    const handleAddToCart = (id: number) => {
        // TODO: Thêm vào giỏ hàng
        console.log('Added to cart:', id);
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <AuthHeader title="Best Seller" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                <Text className="text-gray-600 text-center mb-6">Discover our most popular dishes!</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="flex-row flex-wrap justify-between">
                        {items.map((item) => (
                            <BestSellerItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                rating={item.rating}
                                image={item.image}
                                liked={item.liked}
                                onToggleLike={handleToggleLike}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default BestSellerScreen;
