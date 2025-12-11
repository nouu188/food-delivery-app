// components/cart/CartItem.tsx
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, X } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    item: {
        id: number;
        name: string;
        price: number;
        qty: number;
        image: any;
    };
};

export const CartItem = ({ item }: Props) => {
    const { updateQty, removeItem } = useCartStore();

    return (
        <View className="flex-row bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm">
            <Image source={item.image} className="w-24 h-24 rounded-xl" resizeMode="cover" />

            <View className="flex-1 ml-4 justify-between">
                <Text className="font-bold text-lg text-gray-900">{item.name}</Text>
                <Text className="text-orange-600 text-xl font-bold">${item.price.toFixed(2)}</Text>
            </View>

            <View className="items-center justify-between">
                {/* Nút xóa */}
                <TouchableOpacity onPress={() => removeItem(item.id)} className="mb-3">
                    <X size={22} color="#94A3B8" />
                </TouchableOpacity>

                {/* Số lượng */}
                <View className="flex-row items-center bg-orange-100 px-4 py-2 rounded-full gap-3">
                    <TouchableOpacity
                        onPress={() => item.qty > 1 && updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                    >
                        <Minus size={18} color={item.qty <= 1 ? '#CBD5E0' : '#E95322'} />
                    </TouchableOpacity>

                    <Text className="font-bold text-orange-600 text-base w-8 text-center">{item.qty}</Text>

                    <TouchableOpacity onPress={() => updateQty(item.id, item.qty + 1)}>
                        <Plus size={18} color="#E95322" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
