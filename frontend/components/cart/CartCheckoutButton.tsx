import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export const CartCheckoutButton = () => (
  <TouchableOpacity
    onPress={() => router.push("/cart/checkout")}
    className="bg-orange-500 py-5 rounded-full mt-6 shadow-2xl"
  >
    <Text className="text-white text-center text-xl font-bold">Checkout</Text>
  </TouchableOpacity>
);