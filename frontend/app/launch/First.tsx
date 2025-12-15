import { Orange_Logo } from "@/assets/icons";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <SafeAreaView className="flex-1 bg-primary-base">
            <Animated.View
                className="flex-1 justify-center items-center"
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <Orange_Logo />
            </Animated.View>
        </SafeAreaView>
    );
}
