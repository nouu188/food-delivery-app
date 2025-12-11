import { Image, Text, View } from 'react-native';

type Props = {
    item: {
        name: string;
        price: number;
        qty: number;
        image: any;
    };
};

export const OrderItemRow = ({ item }: Props) => (
    <View className="flex-row items-center bg-gray-50 rounded-xl p-4 mb-3">
        <Image source={item.image} className="w-16 h-16 rounded-lg" resizeMode="cover" />
        <View className="flex-1 ml-4">
            <Text className="font-medium text-gray-900">{item.name}</Text>
            <Text className="text-sm text-gray-500">
                ${item.price.toFixed(2)} × {item.qty}
            </Text>
        </View>
        <Text className="font-bold text-lg text-gray-900">${(item.price * item.qty).toFixed(2)}</Text>
    </View>
);
