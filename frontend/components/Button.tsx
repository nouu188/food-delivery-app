import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  background: string;
  color?: string;
  onPress?: () => void;
};

const ButtonComponent = ({
  title,
  background,
  color,
  onPress,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`w-[207px] h-[45px] rounded-[30px] flex justify-center items-center my-1 bg-${background}`}
      onPress={onPress}
    >
      <Text className={`text-xl font-bold text-${color || "white"}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
