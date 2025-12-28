import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useToastStore } from "@/store/useToastStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ToastHost() {
    const isVisible = useToastStore((s) => s.isVisible);
    const toast = useToastStore((s) => s.current);
    const hide = useToastStore((s) => s.hide);

    const insets = useSafeAreaInsets();

    const translateX = useRef(new Animated.Value(24)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const colors = useMemo(() => {
        const type = toast?.type;
        if (type === "success") return { bg: "#16A34A", fg: "#FFFFFF" };
        if (type === "error") return { bg: "#DC2626", fg: "#FFFFFF" };
        return { bg: "#111827", fg: "#FFFFFF" };
    }, [toast?.type]);

    useEffect(() => {
        if (!isVisible || !toast) return;

        // Subtle haptics for feedback (user explicitly asked for a bit more liveliness)
        if (toast.type === "success")
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        if (toast.type === "error") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});

        if (hideTimer.current) clearTimeout(hideTimer.current);

        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 8, tension: 90 }),
        ]).start();

        hideTimer.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
                Animated.timing(translateX, { toValue: 24, duration: 160, useNativeDriver: true }),
            ]).start(({ finished }) => {
                if (finished) hide();
            });
        }, toast.durationMs ?? 2800);

        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [hide, insets.top, isVisible, opacity, toast, translateX]);

    if (!isVisible || !toast) return null;

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <View pointerEvents="box-none" style={[styles.container, { top: Math.max(12, insets.top + 10) }]}>
                <Animated.View
                    style={{
                        width: "100%",
                        transform: [{ translateX }],
                        opacity,
                    }}
                >
                    <Pressable onPress={hide} style={[styles.toast, { backgroundColor: colors.bg }]}>
                        {toast.title ? (
                            <Text style={[styles.title, { color: colors.fg }]} numberOfLines={1}>
                                {toast.title}
                            </Text>
                        ) : null}
                        <Text style={[styles.message, { color: colors.fg }]} numberOfLines={3}>
                            {toast.message}
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 12,
        left: 12,
        alignItems: "flex-end",
    },
    toast: {
        maxWidth: 340,
        width: "100%",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },
});
