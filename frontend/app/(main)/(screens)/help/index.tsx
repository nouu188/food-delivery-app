import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function HelpScreen() {
    const router = useRouter();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order in real-time from the Orders tab. Click on any active order to see its current status and estimated delivery time.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept Cash on Delivery (COD), Credit/Debit Cards, MoMo wallet, VNPay, and App Wallet. You can manage your payment methods in Settings.",
        },
        {
            question: "How can I cancel an order?",
            answer: "You can cancel an order before it's been confirmed by the restaurant. Go to Order Details and tap the 'Cancel Order' button. Please note that confirmed orders cannot be cancelled.",
        },
        {
            question: "What is your refund policy?",
            answer: "Refunds are processed within 5-7 business days for cancelled orders. The refund will be credited back to your original payment method or app wallet.",
        },
        {
            question: "How do I contact customer support?",
            answer: "You can reach us via phone, email, or live chat. Our support team is available 24/7 to assist you with any queries or issues.",
        },
    ];

    const contactOptions = [
        {
            icon: "phone" as const,
            label: "Call Us",
            value: "+1 (123) 456-7890",
            onPress: () => Linking.openURL("tel:+11234567890"),
        },
        {
            icon: "mail" as const,
            label: "Email Us",
            value: "support@foodapp.com",
            onPress: () => Linking.openURL("mailto:support@foodapp.com"),
        },
        {
            icon: "message-circle" as const,
            label: "Live Chat",
            value: "Chat with our support team",
            onPress: () => {},
        },
    ];

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Help & Support" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="bg-[#FFE3D6] rounded-2xl p-4 mb-6">
                        <Text className="text-[#070707] font-bold text-lg">How can we help you?</Text>
                        <Text className="text-[#6B7280] text-sm mt-2">
                            Find answers to common questions or reach out to our support team
                        </Text>
                    </View>

                    <Text className="text-[#070707] font-bold text-base mb-3">Contact Us</Text>
                    <View className="mb-6">
                        {contactOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={option.onPress}
                                className="bg-[#FFF5D6] rounded-2xl p-4 mb-3 flex-row items-center"
                            >
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: "#FFE3D6" }}
                                >
                                    <Feather name={option.icon} size={24} color="#E95322" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[#070707] font-semibold">{option.label}</Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">{option.value}</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-[#070707] font-bold text-base mb-3">Frequently Asked Questions</Text>
                    <View className="mb-6">
                        {faqs.map((faq, index) => {
                            const isExpanded = expandedFaq === index;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.7}
                                    onPress={() => toggleFaq(index)}
                                    className="bg-[#FFF5D6] rounded-2xl p-4 mb-3"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-[#070707] font-semibold flex-1 pr-2">{faq.question}</Text>
                                        <Feather
                                            name={isExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#E95322"
                                        />
                                    </View>
                                    {isExpanded && (
                                        <Text className="text-[#6B7280] text-sm mt-3 leading-5">{faq.answer}</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="bg-[#FFE3D6] rounded-2xl p-4">
                        <Text className="text-[#070707] font-semibold mb-2">Still need help?</Text>
                        <Text className="text-[#6B7280] text-sm mb-4">
                            Send us a message and we will get back to you as soon as possible
                        </Text>
                        <TouchableOpacity className="bg-[#E95322] rounded-full py-3 items-center" activeOpacity={0.9}>
                            <Text className="text-white font-semibold">Send Feedback</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
