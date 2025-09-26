import React from "react";
import { View } from "react-native";

type IndicatorProps = {
  currentStep: number;
};

const Indicator = ({ currentStep }: IndicatorProps) => {
  const active = "bg-OrangeBase";
  const inactive = "bg-Yellow_2";

  return (
    // Indicator
    <View className="flex-row gap-x-2">
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          className={`w-[20px] h-[4px] rounded-xl ${
            currentStep === step ? active : inactive
          }`}
        ></View>
      ))}
    </View>
  );
};

export default Indicator;
