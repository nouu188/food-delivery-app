import Header from "@/components/common/Header";
import React, { useRef, useState, useEffect } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Bot, User, Clock, CheckCheck, Package, DollarSign, MapPin, Settings2, HelpCircle } from "lucide-react-native";

type MessageFrom = "user" | "bot";

interface Message {
    id: string;
    from: MessageFrom;
    text: string;
    time: string;
    type?: "text" | "quick-reply" | "options";
    options?: string[];
    isDelivered?: boolean;
    isRead?: boolean;
}

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    message: string;
}

export default function SupportScreen() {
    const flatListRef = useRef<FlatList>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "m1",
            from: "bot",
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            text: "Hi there! 👋 I'm your virtual assistant. How can I help you today?",
            type: "options",
            options: ["Track Order", "Payment Issues", "Account Help", "Report Problem"],
            isDelivered: true,
            isRead: true,
        },
    ]);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);

    const quickActions: QuickAction[] = [
        {
            id: "track",
            label: "Track Order",
            icon: <Package size={20} color="#E95322" />,
            message: "I want to track my order",
        },
        {
            id: "payment",
            label: "Payment Help",
            icon: <DollarSign size={20} color="#E95322" />,
            message: "I need help with payment",
        },
        {
            id: "delivery",
            label: "Delivery Info",
            icon: <MapPin size={20} color="#E95322" />,
            message: "Question about delivery",
        },
        {
            id: "other",
            label: "Other Issues",
            icon: <HelpCircle size={20} color="#E95322" />,
            message: "I have a different question",
        },
    ];

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const sendMessage = (messageText?: string) => {
        const textToSend = messageText || text.trim();
        if (!textToSend) return;

        const newMessage: Message = {
            id: `m_${Date.now()}`,
            from: "user",
            text: textToSend,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isDelivered: false,
            isRead: false,
        };

        setMessages((prev) => [...prev, newMessage]);
        setText("");
        setShowQuickActions(false);

        // Simulate delivery
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg
                )
            );
        }, 500);

        // Simulate bot typing and response
        setIsTyping(true);
        setTimeout(() => {
            const botResponse = generateBotResponse(textToSend);
            const botMessage: Message = {
                id: `m_bot_${Date.now()}`,
                from: "bot",
                text: botResponse,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                isDelivered: true,
                isRead: true,
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);

            // Mark user message as read
            setTimeout(() => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === newMessage.id ? { ...msg, isRead: true } : msg
                    )
                );
            }, 1000);
        }, 1500 + Math.random() * 1000);
    };

    const generateBotResponse = (userMessage: string): string => {
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes("track") || lowerMsg.includes("order")) {
            return "To track your order:\n\n1. Go to the Orders tab 📦\n2. Select your active order\n3. View real-time tracking\n\nWould you like me to help you with anything else?";
        } else if (lowerMsg.includes("payment") || lowerMsg.includes("refund")) {
            return "For payment issues:\n\n• Refunds take 5-7 business days\n• Check your payment method in Settings\n• Contact your bank if needed\n\nNeed more specific help?";
        } else if (lowerMsg.includes("delivery") || lowerMsg.includes("time")) {
            return "Delivery information:\n\n• Standard delivery: 25-35 mins\n• Delivery hours: 6 AM - 11 PM\n• Track your driver in real-time\n\nAnything else I can help with?";
        } else if (lowerMsg.includes("cancel")) {
            return "To cancel an order:\n\n✓ Only PENDING/CONFIRMED orders can be cancelled\n✓ Go to Order Details → Cancel Order\n✓ Refund processed in 5-7 days\n\nNeed help with a specific order?";
        } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
            return "Hello! 👋 How can I assist you today?";
        } else if (lowerMsg.includes("thank")) {
            return "You're welcome! Is there anything else I can help you with? 😊";
        } else {
            return "I understand you need help with that. Our support team is here to assist!\n\nFor complex issues, you can:\n\n📞 Call: +1 (123) 456-7890\n📧 Email: support@foodapp.com\n\nOr describe your issue in more detail.";
        }
    };

    const handleQuickAction = (action: QuickAction) => {
        sendMessage(action.message);
    };

    const connectToAgent = () => {
        Alert.alert(
            "Connect to Agent",
            "Would you like to be connected to a human support agent? Average wait time is 2-3 minutes.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Connect",
                    onPress: () => {
                        const agentMessage: Message = {
                            id: `m_agent_${Date.now()}`,
                            from: "bot",
                            text: "Connecting you to the next available agent... Please wait.",
                            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            isDelivered: true,
                            isRead: true,
                        };
                        setMessages((prev) => [...prev, agentMessage]);

                        setTimeout(() => {
                            const connectedMessage: Message = {
                                id: `m_connected_${Date.now()}`,
                                from: "bot",
                                text: "Agent Sarah has joined the chat. Hello! How can I help you today? 👋",
                                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                isDelivered: true,
                                isRead: true,
                            };
                            setMessages((prev) => [...prev, connectedMessage]);
                        }, 3000);
                    },
                },
            ]
        );
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.from === "user";

        return (
            <View className={`mb-4 px-4 ${isUser ? "items-end" : "items-start"}`}>
                <View className={`flex-row items-end ${isUser ? "flex-row-reverse" : ""}`}>
                    <View
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                            isUser ? "bg-[#E95322] ml-2" : "bg-[#FFE3D6] mr-2"
                        }`}
                    >
                        {isUser ? (
                            <User size={16} color="#FFFFFF" />
                        ) : (
                            <Bot size={16} color="#E95322" />
                        )}
                    </View>

                    <View className={`max-w-[75%]`}>
                        <View
                            className={`rounded-2xl px-4 py-3 ${
                                isUser
                                    ? "bg-[#E95322] rounded-br-md"
                                    : "bg-[#F9FAFB] border border-[#E5E7EB] rounded-bl-md"
                            }`}
                            style={{
                                shadowColor: '#000',
                                shadowOpacity: 0.05,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <Text
                                className={`${isUser ? "text-white" : "text-[#070707]"} leading-5`}
                                style={{ fontSize: 14 }}
                            >
                                {item.text}
                            </Text>

                            {item.options && (
                                <View className="mt-3 space-y-2">
                                    {item.options.map((option, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            className="bg-white border border-[#E95322] rounded-full px-4 py-2 mt-2"
                                            activeOpacity={0.7}
                                            onPress={() => sendMessage(option)}
                                        >
                                            <Text className="text-[#E95322] font-semibold text-center text-sm">
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View className={`flex-row items-center mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                            <Clock size={10} color="#9CA3AF" />
                            <Text className="text-[#9CA3AF] text-xs ml-1">{item.time}</Text>
                            {isUser && item.isDelivered && (
                                <CheckCheck
                                    size={14}
                                    color={item.isRead ? "#10B981" : "#9CA3AF"}
                                    className="ml-1"
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Live Support" />

            <View className="flex-1 bg-white rounded-t-3xl">
                <View className="px-6 py-3 border-b border-[#E5E7EB]">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-[#070707] font-bold text-base">Support Team</Text>
                            <Text className="text-[#10B981] text-xs mt-0.5">● Online - Avg. response: 2 min</Text>
                        </View>
                        <TouchableOpacity
                            onPress={connectToAgent}
                            className="bg-[#FFE3D6] px-4 py-2 rounded-full"
                            activeOpacity={0.7}
                        >
                            <Text className="text-[#E95322] font-semibold text-xs">Talk to Agent</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showQuickActions && (
                    <View className="px-6 py-4 border-b border-[#E5E7EB]">
                        <Text className="text-[#6B7280] text-xs font-semibold mb-3">QUICK ACTIONS</Text>
                        <View className="flex-row flex-wrap">
                            {quickActions.map((action) => (
                                <TouchableOpacity
                                    key={action.id}
                                    className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-4 py-3 mr-2 mb-2 flex-row items-center"
                                    activeOpacity={0.7}
                                    onPress={() => handleQuickAction(action)}
                                >
                                    {action.icon}
                                    <Text className="text-[#070707] font-semibold text-xs ml-2">
                                        {action.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                    className="flex-1"
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(m) => m.id}
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
                        renderItem={renderMessage}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />

                    {isTyping && (
                        <View className="px-4 mb-4 items-start">
                            <View className="flex-row items-end">
                                <View className="w-8 h-8 rounded-full items-center justify-center bg-[#FFE3D6] mr-2">
                                    <Bot size={16} color="#E95322" />
                                </View>
                                <View className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl rounded-bl-md px-4 py-3">
                                    <View className="flex-row space-x-1">
                                        <View className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce" />
                                        <View className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce delay-100" />
                                        <View className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce delay-200" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    <View
                        className="px-4 pb-4 pt-3 bg-white border-t border-[#E5E7EB]"
                        style={{
                            shadowColor: '#000',
                            shadowOpacity: 0.05,
                            shadowOffset: { width: 0, height: -2 },
                            shadowRadius: 8,
                            elevation: 5,
                        }}
                    >
                        <View className="flex-row items-center bg-[#F9FAFB] rounded-full border border-[#E5E7EB] px-4 py-2">
                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder="Type your message..."
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-[#070707] py-2"
                                multiline
                                maxLength={500}
                                onSubmitEditing={() => sendMessage()}
                            />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => sendMessage()}
                                className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                                    text.trim() ? "bg-[#E95322]" : "bg-[#E5E7EB]"
                                }`}
                                disabled={!text.trim()}
                            >
                                <Send size={18} color={text.trim() ? "#FFFFFF" : "#9CA3AF"} />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[#9CA3AF] text-xs mt-2 text-center">
                            Powered by AI • Messages are secure and encrypted
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
