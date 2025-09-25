import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  background: string;
};

const ButtonComponent = ({ title, onPress, background }: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      className={`w-[207px] h-[45px] rounded-[30px] flex justify-center items-center my-1`}
      style={{ backgroundColor: isPressed ? "Yellow_2" : background }}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Text className="text-xl font-bold text-OrangeBase">{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
