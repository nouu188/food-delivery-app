import { Text, View } from 'react-native';
import { Check, Clock } from 'lucide-react-native';

const steps = [
    { label: 'Your order has been accepted', time: '2 min', done: true },
    { label: 'The restaurant is preparing your order', time: '5 min', done: true },
    { label: 'The delivery is on the way', time: '10 min', done: false },
    { label: 'Your order has been delivered', time: '8 min', done: false },
];

export const DeliveryTimeline = () => (
    <View>
        <Text className="text-lg font-bold mb-4">Delivery Time</Text>
        <View className="bg-gray-50 rounded-xl p-4">
            <Text className="font-bold text-3xl text-orange-600 mb-1">25 mins</Text>
            <Text className="text-gray-600">Estimated Delivery</Text>
        </View>

        <View className="mt-6">
            {steps.map((step, i) => (
                <View key={i} className="flex-row items-center mb-4">
                    {step.done ? <Check size={24} color="#E95322" /> : <Clock size={24} color="#94A3B8" />}
                    <View className="ml-4 flex-1">
                        <Text className={`${step.done ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</Text>
                        <Text className="text-sm text-gray-500">{step.time}</Text>
                    </View>
                </View>
            ))}
        </View>
    </View>
);
