import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
    title: string;
    background: string;
    color?: string;
    onPress?: () => void;
    loading?: boolean;
};

export default function ButtonComponent({ title, background, color, onPress, loading = false }: ButtonProps) {
    return (
        <TouchableOpacity
            className={`w-[207px] h-[45px] rounded-[30px] flex justify-center items-center my-1 bg-${background}`}
            onPress={onPress}
            disabled={loading} // không cho nhấn khi loading
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator size="small" color={color || 'white'} />
            ) : (
                <Text className={`text-xl font-bold text-${color || 'white'}`}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
