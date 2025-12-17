// components/ContactItem.tsx
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
};

export default function ContactItem({ icon, title, onPress }: Props) {
  return (
    <TouchableOpacity className="flex-row items-center py-4" onPress={onPress}>
      <Ionicons name={icon} size={32} color="#FF6B00" />
      <Text className="text-lg ml-5 flex-1">{title}</Text>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );
}