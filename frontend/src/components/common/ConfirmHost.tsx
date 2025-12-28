import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConfirmStore } from "@/store/useConfirmStore";

export default function ConfirmHost() {
    const insets = useSafeAreaInsets();
    const isVisible = useConfirmStore((s) => s.isVisible);
    const payload = useConfirmStore((s) => s.payload);
    const onConfirm = useConfirmStore((s) => s.confirm);
    const onCancel = useConfirmStore((s) => s.cancel);

    if (!payload) return null;

    const confirmBg = payload.destructive ? "#DC2626" : "#E95322";

    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

                <View style={[styles.card, { marginTop: Math.max(16, insets.top + 12) }]}>
                    {payload.title ? <Text style={styles.title}>{payload.title}</Text> : null}
                    <Text style={styles.message}>{payload.message}</Text>

                    <View style={styles.actions}>
                        <Pressable onPress={onCancel} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.cancelText}>{payload.cancelText ?? "Cancel"}</Text>
                        </Pressable>

                        <Pressable onPress={onConfirm} style={[styles.button, { backgroundColor: confirmBg }]}>
                            <Text style={styles.confirmText}>{payload.confirmText ?? "Confirm"}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        paddingHorizontal: 16,
        justifyContent: "flex-start",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 6,
    },
    message: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
        lineHeight: 18,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 14,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    cancelButton: {
        backgroundColor: "#F3F4F6",
    },
    cancelText: {
        color: "#111827",
        fontWeight: "800",
        fontSize: 13,
    },
    confirmText: {
        color: "#FFFFFF",
        fontWeight: "900",
        fontSize: 13,
    },
});
