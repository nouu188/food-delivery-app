import { CreditCard } from 'lucide-react-native';
import { Text, View } from 'react-native';

type Props = {
    method: string;
    last4: string;
    onChange?: () => void;
};

export const PaymentMethodCard = ({ method, last4, onChange }: Props) => (
    <View className="bg-gray-50 rounded-xl p-5 flex-row items-center">
        <CreditCard size={40} color="#E95322" />
        <View className="flex-1 ml-4">
            <Text className="font-bold text-gray-900">{method}</Text>
            <Text className="text-gray-600">•••• •••• •••• {last4}</Text>
        </View>
        {onChange && (
            <Text onPress={onChange} className="text-orange-600 font-medium">
                Change
            </Text>
        )}
    </View>
);
