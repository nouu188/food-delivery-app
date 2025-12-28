import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone, Mail, MessageCircle, Search, ChevronRight, ChevronDown, ChevronUp, Facebook, Twitter, Instagram, Send, HelpCircle, ShieldCheck, CreditCard, MapPin, Clock } from "lucide-react-native";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
}

export default function HelpScreen() {
    const router = useRouter();
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const categories: Category[] = [
        { id: "all", name: "All", icon: <HelpCircle size={20} color="#E95322" />, color: "#FFE3D6" },
        { id: "orders", name: "Orders", icon: <ShieldCheck size={20} color="#10B981" />, color: "#D1FAE5" },
        { id: "payments", name: "Payments", icon: <CreditCard size={20} color="#F59E0B" />, color: "#FEF3C7" },
        { id: "delivery", name: "Delivery", icon: <MapPin size={20} color="#3B82F6" />, color: "#DBEAFE" },
        { id: "account", name: "Account", icon: <Clock size={20} color="#8B5CF6" />, color: "#EDE9FE" },
    ];

    const faqs: FAQ[] = [
        {
            id: "1",
            category: "orders",
            question: "How do I track my order?",
            answer: "You can track your order in real-time from the Orders tab. Click on any active order to see its current status, estimated delivery time, and driver location on the map.",
        },
        {
            id: "2",
            category: "orders",
            question: "How can I cancel an order?",
            answer: "You can cancel an order before it's confirmed by the restaurant. Go to Order Details and tap 'Cancel Order'. Note that confirmed orders cannot be cancelled, but you can contact support for assistance.",
        },
        {
            id: "3",
            category: "orders",
            question: "Can I modify my order after placing it?",
            answer: "Once an order is placed, you cannot modify it directly. However, you can cancel it (if not confirmed) and place a new order, or contact the restaurant directly for minor changes.",
        },
        {
            id: "4",
            category: "payments",
            question: "What payment methods do you accept?",
            answer: "We accept multiple payment methods: Cash on Delivery (COD), Credit/Debit Cards, MoMo wallet, VNPay, and App Wallet. You can manage your payment methods in Settings.",
        },
        {
            id: "5",
            category: "payments",
            question: "What is your refund policy?",
            answer: "Refunds are processed within 5-7 business days for cancelled orders. The amount will be credited back to your original payment method or app wallet. For quality issues, contact support within 24 hours.",
        },
        {
            id: "6",
            category: "payments",
            question: "How do vouchers work?",
            answer: "Enter your voucher code at checkout. Discounts will be automatically applied if the voucher is valid. Each voucher has specific terms like minimum order amount, expiry date, and usage limits.",
        },
        {
            id: "7",
            category: "delivery",
            question: "What are the delivery hours?",
            answer: "Our delivery service operates from 6:00 AM to 11:00 PM daily. Some restaurants may have different hours. Check individual restaurant pages for specific delivery times.",
        },
        {
            id: "8",
            category: "delivery",
            question: "How is delivery fee calculated?",
            answer: "Delivery fees vary based on distance between the restaurant and your location, current demand, and weather conditions. You'll see the exact fee before placing your order.",
        },
        {
            id: "9",
            category: "account",
            question: "How do I update my profile?",
            answer: "Go to Profile → Settings to update your personal information, delivery addresses, payment methods, and preferences. Changes are saved automatically.",
        },
        {
            id: "10",
            category: "account",
            question: "Is my data secure?",
            answer: "Yes! We use industry-standard encryption to protect your data. Your payment information is never stored on our servers. We comply with all data protection regulations.",
        },
    ];

    const contactOptions = [
        {
            icon: <Phone size={24} color="#E95322" />,
            label: "Call Us",
            value: "+1 (123) 456-7890",
            description: "Available 24/7",
            onPress: () => Linking.openURL("tel:+11234567890"),
        },
        {
            icon: <Mail size={24} color="#E95322" />,
            label: "Email Us",
            value: "support@foodapp.com",
            description: "Response within 24 hours",
            onPress: () => Linking.openURL("mailto:support@foodapp.com"),
        },
        {
            icon: <MessageCircle size={24} color="#E95322" />,
            label: "Live Chat",
            value: "Chat with support team",
            description: "Average response: 5 min",
            onPress: () => router.push("/support"),
        },
    ];

    const socialLinks = [
        { icon: <Facebook size={24} color="#1877F2" />, name: "Facebook", url: "https://facebook.com/foodapp" },
        { icon: <Twitter size={24} color="#1DA1F2" />, name: "Twitter", url: "https://twitter.com/foodapp" },
        { icon: <Instagram size={24} color="#E4405F" />, name: "Instagram", url: "https://instagram.com/foodapp" },
    ];

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
        const matchesSearch = searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFaq = (id: string) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleSubmitFeedback = () => {
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            Alert.alert("Required Fields", "Please fill in all required fields");
            return;
        }

        // TODO: Integrate with backend API
        Alert.alert(
            "Thank You!",
            "Your message has been received. Our support team will get back to you within 24 hours.",
            [{ text: "OK", onPress: () => {
                setShowContactForm(false);
                setContactForm({ name: "", email: "", subject: "", message: "" });
            }}]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Help & Support" />

            <View className="flex-1 bg-white rounded-t-3xl">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        className="px-6 pt-6"
                    >
                        <View className="bg-gradient-to-br from-[#FFE3D6] to-[#FFF5D6] rounded-3xl p-6 mb-6"
                            style={{
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowOffset: { width: 0, height: 4 },
                                shadowRadius: 12,
                                elevation: 5,
                            }}
                        >
                            <HelpCircle size={40} color="#E95322" />
                            <Text className="text-[#070707] font-bold text-2xl mt-3">How can we help you?</Text>
                            <Text className="text-[#6B7280] text-sm mt-2 leading-5">
                                Find answers to common questions, contact our support team, or send us your feedback
                            </Text>
                        </View>

                        <View className="mb-6">
                            <View className="bg-[#F9FAFB] rounded-2xl flex-row items-center px-4 py-3 border border-[#E5E7EB]">
                                <Search size={20} color="#9CA3AF" />
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Search for help..."
                                    placeholderTextColor="#9CA3AF"
                                    className="flex-1 ml-3 text-[#070707]"
                                />
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">Quick Contact</Text>
                            {contactOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.7}
                                    onPress={option.onPress}
                                    className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-[#FFE3D6]"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOpacity: 0.05,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowRadius: 8,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="w-14 h-14 rounded-2xl items-center justify-center bg-[#FFE3D6]">
                                        {option.icon}
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="text-[#070707] font-bold text-base">{option.label}</Text>
                                        <Text className="text-[#E95322] text-sm mt-0.5">{option.value}</Text>
                                        <Text className="text-[#9CA3AF] text-xs mt-1">{option.description}</Text>
                                    </View>
                                    <ChevronRight size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">Browse by Category</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="mb-4 -mx-6 px-6"
                            >
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() => setSelectedCategory(category.id)}
                                        className={`mr-3 px-5 py-3 rounded-full flex-row items-center ${
                                            selectedCategory === category.id ? 'bg-[#E95322]' : 'bg-[#F9FAFB]'
                                        }`}
                                        style={{
                                            borderWidth: selectedCategory === category.id ? 0 : 1,
                                            borderColor: '#E5E7EB'
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        {selectedCategory === category.id ? (
                                            <View className="mr-2">{React.cloneElement(category.icon as React.ReactElement)}</View>
                                        ) : (
                                            <View className="mr-2">{category.icon}</View>
                                        )}
                                        <Text className={`font-semibold ${
                                            selectedCategory === category.id ? 'text-white' : 'text-[#070707]'
                                        }`}>
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">
                                {selectedCategory === "all" ? "All Questions" : `${categories.find(c => c.id === selectedCategory)?.name} Questions`}
                                {searchQuery && ` (${filteredFaqs.length} results)`}
                            </Text>
                            {filteredFaqs.length === 0 ? (
                                <View className="py-12 items-center">
                                    <HelpCircle size={48} color="#E5E7EB" />
                                    <Text className="text-[#9CA3AF] mt-4 text-center">
                                        No questions found. Try a different search or category.
                                    </Text>
                                </View>
                            ) : (
                                filteredFaqs.map((faq) => {
                                    const isExpanded = expandedFaq === faq.id;
                                    return (
                                        <TouchableOpacity
                                            key={faq.id}
                                            activeOpacity={0.7}
                                            onPress={() => toggleFaq(faq.id)}
                                            className="bg-[#FFF5D6] rounded-2xl p-4 mb-3"
                                        >
                                            <View className="flex-row items-start justify-between">
                                                <Text className="text-[#070707] font-bold text-base flex-1 pr-4 leading-6">
                                                    {faq.question}
                                                </Text>
                                                {isExpanded ? (
                                                    <ChevronUp size={20} color="#E95322" />
                                                ) : (
                                                    <ChevronDown size={20} color="#E95322" />
                                                )}
                                            </View>
                                            {isExpanded && (
                                                <Text className="text-[#6B7280] text-sm mt-3 leading-6">
                                                    {faq.answer}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </View>

                        {!showContactForm ? (
                            <View className="bg-gradient-to-br from-[#E95322] to-[#D94412] rounded-3xl p-6 mb-6"
                                style={{
                                    shadowColor: '#E95322',
                                    shadowOpacity: 0.3,
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowRadius: 16,
                                    elevation: 8,
                                }}
                            >
                                <Text className="text-white font-bold text-xl mb-2">Still need help?</Text>
                                <Text className="text-white/90 text-sm mb-5 leading-5">
                                    Can't find what you're looking for? Send us a message and we'll get back to you soon.
                                </Text>
                                <TouchableOpacity
                                    className="bg-white rounded-full py-4 items-center flex-row justify-center"
                                    activeOpacity={0.9}
                                    onPress={() => setShowContactForm(true)}
                                >
                                    <Send size={20} color="#E95322" />
                                    <Text className="text-[#E95322] font-bold text-base ml-2">Send Us a Message</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="bg-white rounded-3xl p-6 mb-6 border-2 border-[#E95322]">
                                <Text className="text-[#070707] font-bold text-xl mb-5">Contact Us</Text>

                                <View className="mb-4">
                                    <Text className="text-[#070707] font-semibold mb-2">Name *</Text>
                                    <TextInput
                                        value={contactForm.name}
                                        onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
                                        placeholder="Your full name"
                                        placeholderTextColor="#9CA3AF"
                                        className="bg-[#F9FAFB] rounded-xl px-4 py-3 text-[#070707] border border-[#E5E7EB]"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-[#070707] font-semibold mb-2">Email *</Text>
                                    <TextInput
                                        value={contactForm.email}
                                        onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
                                        placeholder="your.email@example.com"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="bg-[#F9FAFB] rounded-xl px-4 py-3 text-[#070707] border border-[#E5E7EB]"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-[#070707] font-semibold mb-2">Subject (Optional)</Text>
                                    <TextInput
                                        value={contactForm.subject}
                                        onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                                        placeholder="Brief subject"
                                        placeholderTextColor="#9CA3AF"
                                        className="bg-[#F9FAFB] rounded-xl px-4 py-3 text-[#070707] border border-[#E5E7EB]"
                                    />
                                </View>

                                <View className="mb-5">
                                    <Text className="text-[#070707] font-semibold mb-2">Message *</Text>
                                    <TextInput
                                        value={contactForm.message}
                                        onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                                        placeholder="Tell us how we can help you..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        numberOfLines={5}
                                        textAlignVertical="top"
                                        className="bg-[#F9FAFB] rounded-xl px-4 py-3 text-[#070707] border border-[#E5E7EB]"
                                        style={{ minHeight: 120 }}
                                    />
                                </View>

                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        className="flex-1 bg-[#F9FAFB] rounded-full py-4 items-center border border-[#E5E7EB]"
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setShowContactForm(false);
                                            setContactForm({ name: "", email: "", subject: "", message: "" });
                                        }}
                                    >
                                        <Text className="text-[#6B7280] font-bold text-base">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-1 bg-[#E95322] rounded-full py-4 items-center"
                                        activeOpacity={0.9}
                                        onPress={handleSubmitFeedback}
                                    >
                                        <Text className="text-white font-bold text-base">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Social Media Links */}
                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">Follow Us</Text>
                            <View className="flex-row justify-between">
                                {socialLinks.map((social, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.7}
                                        onPress={() => Linking.openURL(social.url)}
                                        className="flex-1 bg-white rounded-2xl p-4 items-center justify-center border border-[#E5E7EB] mx-1"
                                        style={{
                                            shadowColor: '#000',
                                            shadowOpacity: 0.05,
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowRadius: 8,
                                            elevation: 2,
                                        }}
                                    >
                                        {social.icon}
                                        <Text className="text-[#070707] font-semibold text-xs mt-2">{social.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* App Info */}
                        <View className="bg-[#F9FAFB] rounded-2xl p-4 mb-6">
                            <Text className="text-[#6B7280] text-xs text-center leading-5">
                                Food Delivery App v1.0.0{'\n'}
                                © 2025 All rights reserved{'\n'}
                                Terms of Service • Privacy Policy
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
