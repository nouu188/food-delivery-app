import React from 'react';
import { TouchableOpacity, TextInput } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { Search, SlidersHorizontal, XCircle } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  isSearchPage?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isSearchPage = false,
  value = '',
  onChangeText,
  placeholder = 'Search for food...'
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState(value);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  if (!isSearchPage) {
    return (
      <TouchableOpacity
        onPress={() => router.push('/(main)/(tabs)/search')}
        activeOpacity={0.7}
      >
        <XStack
          backgroundColor="white"
          borderRadius={24}
          height={48}
          alignItems="center"
          paddingHorizontal="$4"
          gap="$3"
        >
          <Search size={20} color="#9CA3AF" />
          <YStack flex={1}>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              editable={false}
              style={{
                fontSize: 14,
                color: '#151312',
                fontWeight: '400',
              }}
            />
          </YStack>
          <TouchableOpacity activeOpacity={0.7}>
            <SlidersHorizontal size={20} color="#E95322" />
          </TouchableOpacity>
        </XStack>
      </TouchableOpacity>
    );
  }

  return (
    <XStack
      backgroundColor="white"
      borderRadius={24}
      height={48}
      alignItems="center"
      paddingHorizontal="$4"
      gap="$3"
    >
      <Search size={20} color="#9CA3AF" />
      <YStack flex={1}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={handleChangeText}
          autoFocus
          style={{
            fontSize: 14,
            color: '#151312',
            fontWeight: '400',
            flex: 1,
          }}
        />
      </YStack>
      {searchText.length > 0 && (
        <TouchableOpacity
          onPress={() => handleChangeText('')}
          activeOpacity={0.7}
        >
          <XCircle size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => router.push('/(main)/(tabs)/filter')}
        activeOpacity={0.7}
      >
        <SlidersHorizontal size={20} color="#E95322" />
      </TouchableOpacity>
    </XStack>
  );
};

export default SearchBar;
