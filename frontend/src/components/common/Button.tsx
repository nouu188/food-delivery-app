import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type ButtonBackground = "OrangeBase" | "YellowBase" | "Font" | "Orange_2" | "Yellow_2";

type ButtonTextColor = "white" | "Font";

export interface AppButtonProps {
    title: string;
    onPress: () => void | Promise<void>;
    background?: ButtonBackground;
    color?: ButtonTextColor;
    disabled?: boolean;
    loading?: boolean;
}

const backgroundClassName: Record<ButtonBackground, string> = {
    OrangeBase: "bg-OrangeBase",
    YellowBase: "bg-YellowBase",
    Yellow_2: "bg-Yellow_2",
    Orange_2: "bg-Orange_2",
    Font: "bg-Font",
};

const textClassName: Record<ButtonTextColor, string> = {
    white: "text-white",
    Font: "text-Font",
};

const Button: React.FC<AppButtonProps> = ({
    title,
    onPress,
    background = "OrangeBase",
    color = "white",
    disabled = false,
    loading = false,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={isDisabled}
            className={`h-12 rounded-full items-center justify-center px-6 ${backgroundClassName[background]} ${
                isDisabled ? "opacity-50" : "opacity-100"
            }`}
        >
            {loading ? (
                <ActivityIndicator color={color === "white" ? "#FFFFFF" : "#391713"} />
            ) : (
                <Text className={`text-base font-bold ${textClassName[color]}`}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;
