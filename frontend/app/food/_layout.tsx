import { Stack } from 'expo-router';

export default function FoodLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Food Details' }} />
      <Stack.Screen name="category/[category]" options={{ title: 'Food Category' }} />
    </Stack>
  );
}
