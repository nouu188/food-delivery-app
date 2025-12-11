import { MapPin } from 'lucide-react-native';
import { Text, View } from 'react-native';

type Props = {
    address: string;
    onEdit?: () => void;
};

export const AddressCard = ({ address, onEdit }: Props) => (
    <View className="bg-orange-50 rounded-2xl p-5 flex-row items-start">
        <MapPin size={24} color="#E95322" className="mt-1" />
        <View className="flex-1 ml-4">
            <Text className="text-sm text-gray-600">Shipping Address</Text>
            <Text className="font-bold text-gray-900 mt-1">{address}</Text>
        </View>
        {onEdit && (
            <Text onPress={onEdit} className="text-orange-600 font-medium">
                Edit
            </Text>
        )}
    </View>
);
