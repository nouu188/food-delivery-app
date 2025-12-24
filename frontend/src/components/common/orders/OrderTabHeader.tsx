import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  activeTab: 'Active' | 'Completed' | 'Cancelled';
  onTabChange: (tab: 'Active' | 'Completed' | 'Cancelled') => void;
};

export default function OrderTabHeader({ activeTab, onTabChange }: Props) {
  return (
    <View className="flex-row justify-center bg-white rounded-full px-2 py-2 mb-6 shadow-sm">
      {(['Active', 'Completed', 'Cancelled'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className={`px-6 py-2.5 rounded-full ${
            activeTab === tab ? 'bg-red-600' : 'bg-transparent'
          }`}
        >
          <Text
            className={`font-medium text-sm ${
              activeTab === tab ? 'text-white' : 'text-gray-600'
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}