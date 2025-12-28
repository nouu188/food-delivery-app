import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useToastStore } from "@/store/useToastStore";
import {
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Phone,
    Mail,
    MessageCircle,
    Search,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Facebook,
    Twitter,
    Instagram,
    Send,
    HelpCircle,
    ShieldCheck,
    CreditCard,
    MapPin,
    Clock,
} from "lucide-react-native";

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
    const showToast = useToastStore((s) => s.show);
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
        const matchesSearch =
            searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFaq = (id: string) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleSubmitFeedback = () => {
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            showToast({ type: "error", title: "Required Fields", message: "Please fill in all required fields" });
            return;
        }

        // TODO: Integrate with backend API
        showToast({
            type: "success",
            title: "Thank You!",
            message: "Your message has been received. Our support team will get back to you within 24 hours.",
        });
        setShowContactForm(false);
        setContactForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Help & Support" />

            <View className="flex-1 bg-white rounded-t-3xl">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        className="px-6 pt-6"
                    >
                        <View
                            className="bg-gradient-to-br from-[#FFE3D6] to-[#FFF5D6] rounded-3xl p-6 mb-6"
                            style={{
                                shadowColor: "#000",
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
                                        shadowColor: "#000",
                                        shadowOpacity: 0.05,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowRadius: 8,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="bg-[#FFE3D6] rounded-full p-3 mr-4">{option.icon}</View>
                                    <View className="flex-1">
                                        <Text className="text-[#070707] font-semibold text-base">{option.label}</Text>
                                        <Text className="text-[#E95322] text-sm mt-1">{option.value}</Text>
                                        <Text className="text-[#9CA3AF] text-xs mt-1">{option.description}</Text>
                                    </View>
                                    <ChevronRight size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">Categories</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() => setSelectedCategory(category.id)}
                                        className={`rounded-full px-5 py-3 mr-3 flex-row items-center ${
                                            selectedCategory === category.id ? "bg-[#E95322]" : "bg-[#F9FAFB]"
                                        }`}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: selectedCategory === category.id ? "#E95322" : "#E5E7EB",
                                        }}
                                    >
                                        {category.icon}
                                        <Text
                                            className={`ml-2 font-semibold ${
                                                selectedCategory === category.id ? "text-white" : "text-[#070707]"
                                            }`}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">
                                Frequently Asked Questions ({filteredFaqs.length})
                            </Text>
                            {filteredFaqs.map((faq) => {
                                const isExpanded = expandedFaq === faq.id;
                                return (
                                    <TouchableOpacity
                                        key={faq.id}
                                        onPress={() => toggleFaq(faq.id)}
                                        className="bg-white rounded-2xl p-4 mb-3 border border-[#E5E7EB]"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOpacity: 0.05,
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowRadius: 8,
                                            elevation: 2,
                                        }}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-[#070707] font-semibold flex-1 pr-2">
                                                {faq.question}
                                            </Text>
                                            {isExpanded ? (
                                                <ChevronUp size={20} color="#E95322" />
                                            ) : (
                                                <ChevronDown size={20} color="#E95322" />
                                            )}
                                        </View>
                                        {isExpanded && (
                                            <Text className="text-[#6B7280] text-sm mt-3 leading-5">{faq.answer}</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View className="bg-[#FFE3D6] rounded-2xl p-4 mb-6">
                            <Text className="text-[#070707] font-semibold mb-2">Still need help?</Text>
                            <Text className="text-[#6B7280] text-sm mb-4">
                                Send us a message and we will get back to you as soon as possible
                            </Text>
                            <TouchableOpacity
                                className="bg-[#E95322] rounded-full py-3 items-center"
                                activeOpacity={0.9}
                                onPress={() => setShowContactForm(true)}
                            >
                                <Text className="text-white font-semibold">Send Feedback</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#070707] font-bold text-lg mb-4">Follow Us</Text>
                            <View className="flex-row justify-around">
                                {socialLinks.map((social, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => Linking.openURL(social.url)}
                                        className="bg-white rounded-full p-4 items-center justify-center border border-[#E5E7EB]"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOpacity: 0.05,
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowRadius: 8,
                                            elevation: 2,
                                            width: 60,
                                            height: 60,
                                        }}
                                    >
                                        {social.icon}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
