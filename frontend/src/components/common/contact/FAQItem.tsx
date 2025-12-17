// components/FAQItem.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="border-b border-gray-200">
      <TouchableOpacity
        className="flex-row justify-between items-center py-4"
        onPress={() => setExpanded(!expanded)}
      >
        <Text className="text-base flex-1 mr-3">{question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#FF6B00"
        />
      </TouchableOpacity>
      {expanded && (
        <View className="pb-4">
          <Text className="text-sm text-gray-600 leading-5">{answer}</Text>
        </View>
      )}
    </View>
  );
}