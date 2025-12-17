import Header from "@/components/common/Header";
import React from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

type Msg = { id: string; from: "me" | "admin"; text: string; time: string };

const initial: Msg[] = [
    {
        id: "m1",
        from: "admin",
        time: "09:00",
        text: "Hello!, please choose the\nnumber corresponding to your\nneeds for a more efficient\nservice.\n\n1. Order Management\n2. Payments Management\n3. Account management and\nprofile\n4. About order tracking\n5. Safety",
    },
];

export default function SupportScreen() {
    const [messages, setMessages] = React.useState<Msg[]>(initial);
    const [text, setText] = React.useState("");

    const send = () => {
        const t = text.trim();
        if (!t) return;
        setMessages((prev) => [...prev, { id: `m_${Date.now()}`, from: "me", text: t, time: "09:03" }]);
        setText("");
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Support" />

            <View className="flex-1 bg-white rounded-t-3xl px-4 pt-4">
                <FlatList
                    data={messages}
                    keyExtractor={(m) => m.id}
                    contentContainerStyle={{ paddingBottom: 90, paddingTop: 10 }}
                    renderItem={({ item }) => {
                        const isMe = item.from === "me";
                        return (
                            <View className={`mb-4 ${isMe ? "items-end" : "items-start"}`}>
                                <View
                                    className={`rounded-2xl px-4 py-3 max-w-[85%] ${isMe ? "" : ""}`}
                                    style={{
                                        backgroundColor: isMe ? "#FFF5D6" : "#FFFFFF",
                                        borderWidth: isMe ? 0 : 1,
                                        borderColor: isMe ? "transparent" : "#FFD8C7",
                                    }}
                                >
                                    <Text style={{ color: "#070707" }}>{item.text}</Text>
                                </View>
                                <Text className="text-[#9CA3AF] text-xs mt-1">{item.time}</Text>
                            </View>
                        );
                    }}
                />

                <View className="absolute left-0 right-0 bottom-0 px-4 pb-4">
                    <View
                        className="flex-row items-center bg-white rounded-full border px-4 py-2"
                        style={{ borderColor: "#FFD8C7" }}
                    >
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder="Write Here..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1"
                            style={{ color: "#070707" }}
                        />
                        <TouchableOpacity activeOpacity={0.85} onPress={send} className="ml-3">
                            <Feather name="send" size={18} color="#E95322" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
