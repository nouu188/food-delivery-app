import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  activeTab: 'Active' | 'Completed' | 'Cancelled';
  onTabChange: (tab: 'Active' | 'Completed' | 'Cancelled') => void;
  counts?: {
    active?: number;
    completed?: number;
    cancelled?: number;
  };
};

export default function OrderTabHeader({ activeTab, onTabChange, counts }: Props) {
  const tabs = [
    { key: 'Active' as const, label: 'Active', count: counts?.active },
    { key: 'Completed' as const, label: 'Completed', count: counts?.completed },
    { key: 'Cancelled' as const, label: 'Cancelled', count: counts?.cancelled },
  ];

  return (
    <View className="flex-row justify-center bg-gray-100 rounded-full px-1.5 py-1.5 mb-6">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          className={`flex-1 px-4 py-3 rounded-full flex-row items-center justify-center ${
            activeTab === tab.key ? 'bg-[#E95322]' : 'bg-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold text-sm ${
              activeTab === tab.key ? 'text-white' : 'text-[#6B7280]'
            }`}
          >
            {tab.label}
          </Text>
          {tab.count !== undefined && tab.count > 0 && (
            <View
              className={`ml-1.5 px-2 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-white/30' : 'bg-[#E95322]/20'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === tab.key ? 'text-white' : 'text-[#E95322]'
                }`}
              >
                {tab.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
