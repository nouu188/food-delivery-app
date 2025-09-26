import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

const MainButton = ({ title, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity
      className="w-[207px] h-[45px] rounded-[30px] flex justify-center items-center my-1 bg-OrangeBase"
      onPress={onPress}
    >
      <Text className="text-white font-medium text-[17px] leading-[20px] tracking-[-0.5px] text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default MainButton;
