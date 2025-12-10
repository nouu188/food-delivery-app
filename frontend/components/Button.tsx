// components/Button.tsx
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
    title: string;
    background: string; // ví dụ: "OrangeBase", "red-500"...
    color?: string;
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean; // THÊM DÒNG NÀY
} & Omit<TouchableOpacityProps, 'disabled'>; // để kế thừa các props khác nếu cần

export default function ButtonComponent({
    title,
    background,
    color = 'white',
    onPress,
    loading = false,
    disabled = false,
    ...rest
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            className={`w-[207px] h-[45px] rounded-[30px] flex justify-center items-center my-1 bg-${background} ${
                isDisabled ? 'opacity-60' : ''
            }`}
            onPress={onPress}
            disabled={isDisabled} // đúng rồi
            activeOpacity={0.8}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <Text className={`text-xl font-bold`} style={{ color }}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}
