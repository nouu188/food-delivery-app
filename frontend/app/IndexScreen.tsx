import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import First from "./launch/First";

export default function IndexScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(1)).current; // opacity ban đầu = 1

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                router.replace("/launch/welcome");
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [fadeAnim]);

    return (
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
            <First />
        </Animated.View>
    );
}
