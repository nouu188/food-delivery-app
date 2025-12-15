import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfileScreen() {
    const { profile, isHydrated, setProfile } = useUserStore();

    const [fullName, setFullName] = useState(profile.fullName);
    const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth);
    const [email, setEmail] = useState(profile.email);
    const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
    const [avatar, setAvatar] = useState(profile.avatar);

    useEffect(() => {
        if (isHydrated) {
            setFullName(profile.fullName);
            setDateOfBirth(profile.dateOfBirth);
            setEmail(profile.email);
            setPhoneNumber(profile.phoneNumber);
            setAvatar(profile.avatar);
        }
    }, [isHydrated, profile]);

    const handleUpdateProfile = () => {
        setProfile({
            fullName,
            dateOfBirth,
            email,
            phoneNumber,
            avatar,
        });
        Alert.alert("Success", "Profile updated successfully!");
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
        }
    };

    if (!isHydrated) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Feather name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My profile</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.profilePicContainer}>
                    <Image source={{ uri: avatar }} style={styles.profilePic} />
                    <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
                        <Feather name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="John Smith"
                    />

                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                        placeholder="DD / MM / YYYY"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="johnsmith@example.com"
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        placeholder="+123 567 89000"
                    />
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFD34E", // Màu nền vàng của header
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
        backgroundColor: "#FF6347", // Màu cam
        borderRadius: 15,
        paddingVertical: 18,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});
