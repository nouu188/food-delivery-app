import { Camera } from "@/assets/icons";
import { useUserStore } from "@/store/useUserStore";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/common/Header";
import { showErrorAlert } from "@/utils/error-handler";
import { useToastStore } from "@/store/useToastStore";

export default function MyProfileScreen() {
    const { profile, isLoading, fetchProfile, updateProfile } = useUserStore();
    const showToast = useToastStore((s) => s.show);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setEmail(profile.email || "");
            setPhone(profile.phone || "");
            setAvatar(profile.avatar_url || "");
        }
    }, [profile]);

    const handleUpdateProfile = async () => {
        if (!fullName.trim()) {
            showToast({ type: "error", title: "Validation", message: "Full name is required." });
            return;
        }

        const isLocalAvatar = typeof avatar === "string" && avatar.length > 0 && !/^https?:\/\//i.test(avatar);
        const serverAvatar = (profile?.avatar_url ?? "").trim();
        const avatarChanged = (avatar ?? "").trim() !== serverAvatar;
        if (avatarChanged && isLocalAvatar) {
            showToast({
                type: "info",
                title: "Avatar",
                message: "Avatar hiện chỉ đổi tạm trên máy. Muốn lưu lên server cần backend upload endpoint.",
            });
            return;
        }

        const initialFullName = (profile?.full_name ?? "").trim();
        const nextFullName = fullName.trim();
        const initialPhone = (profile?.phone ?? "").trim();
        const nextPhone = phone.trim();

        const payload: any = {};
        if (nextFullName !== initialFullName) payload.full_name = nextFullName;
        if (nextPhone !== initialPhone) payload.phone = nextPhone;

        // Only allow avatar_url updates when user provides a real URL (backend expects URL)
        if (avatarChanged && /^https?:\/\//i.test((avatar ?? "").trim())) {
            payload.avatar_url = (avatar ?? "").trim();
        }

        if (Object.keys(payload).length === 0) {
            showToast({ type: "info", title: "Info", message: "No changes to update." });
            return;
        }

        setIsUpdating(true);
        try {
            await updateProfile(payload);
            showToast({ type: "success", title: "Success", message: "Profile updated successfully." });
        } catch (error) {
            showErrorAlert(error, "Failed to Update Profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            showToast({
                type: "info",
                title: "Avatar",
                message: "Đã chọn ảnh. Hiện tại chỉ preview, chưa thể lưu lên server (thiếu backend upload endpoint).",
            });
        }
    };

    if (isLoading && !profile) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Header title="My Profile" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6347" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="My Profile" />

            <View style={styles.container}>
                <View style={styles.profilePicContainer}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.profilePic} />
                    ) : (
                        <View style={[styles.profilePic, styles.profilePicPlaceholder]}>
                            <Feather name="user" size={44} color="#9CA3AF" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
                        <Camera width={20} height={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="John Smith"
                        editable={!isUpdating}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="johnsmith@example.com"
                        editable={false}
                    />
                    <Text style={styles.note}>Email cannot be changed</Text>

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="+123 567 89000"
                        editable={!isUpdating}
                    />

                    {profile?.role && (
                        <>
                            <Text style={styles.label}>Account Type</Text>
                            <TextInput style={styles.input} value={profile.role} editable={false} />
                        </>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
                    onPress={handleUpdateProfile}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.updateButtonText}>Update Profile</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5CB58", // Màu nền vàng của header
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 16,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 30,
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 12,
        color: "#6B7280",
        fontSize: 14,
    },
    profilePicContainer: {
        position: "relative",
        marginBottom: 30,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 20, // Bo tròn nhẹ
        borderWidth: 2,
        borderColor: "#FFF",
    },
    profilePicPlaceholder: {
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    cameraIconContainer: {
        position: "absolute",
        bottom: -5,
        right: -5,
        backgroundColor: "#FF6347", // Màu cam
        padding: 8,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#FFF",
    },
    form: {
        width: "100%",
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#FFF5D6", // Màu nền vàng nhạt cho input
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 16,
        marginBottom: 20,
        color: "#333",
    },
    updateButton: {
        backgroundColor: "#E95322", // Màu cam
        borderRadius: 100,
        paddingVertical: 18,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    updateButtonDisabled: {
        opacity: 0.6,
    },
    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    note: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: -12,
        marginBottom: 12,
    },
});
