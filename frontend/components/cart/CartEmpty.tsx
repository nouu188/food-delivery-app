import { Plus, ShoppingCart } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export const CartEmpty = () => (
    <View className="flex-1 bg-orange-500 justify-center items-center px-10">
        <View className="bg-white/20 rounded-full p-12 mb-8">
            <ShoppingCart size={100} color="white" />
        </View>
        <Text className="text-white text-3xl font-bold text-center mb-4">Your cart is empty</Text>
        <Text className="text-white/80 text-center text-lg mb-10">
            Looks like you haven't added anything to your cart yet
        </Text>
        <TouchableOpacity className="bg-white rounded-full p-8 shadow-2xl">
            <Plus size={50} color="#E95322" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-medium mt-6">Want To Add Something?</Text>
    </View>
);
