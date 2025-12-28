import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ticket, X, Check, AlertCircle } from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';

interface VoucherInputProps {
    restaurantId: string;
    onSuccess?: () => void;
}

export default function VoucherInput({ restaurantId, onSuccess }: VoucherInputProps) {
    const {
        appliedVoucher,
        voucherValidating,
        voucherError,
        applyVoucher,
        removeVoucher,
    } = useCartStore();

    const [voucherCode, setVoucherCode] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;

        try {
            const result = await applyVoucher(voucherCode.trim().toUpperCase(), restaurantId);
            if (result.is_valid) {
                setVoucherCode('');
                setIsExpanded(false);
                onSuccess?.();
            }
        } catch (error) {
            // Error is handled in the store
        }
    };

    const handleRemoveVoucher = () => {
        removeVoucher();
        setVoucherCode('');
    };

    if (appliedVoucher) {
        return (
            <View style={styles.appliedContainer}>
                <View style={styles.appliedHeader}>
                    <View style={styles.appliedIconBox}>
                        <Check size={20} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <View style={styles.appliedInfo}>
                        <Text style={styles.appliedLabel}>Voucher Applied</Text>
                        <Text style={styles.appliedCode}>{appliedVoucher.voucher.code}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleRemoveVoucher}
                        style={styles.removeButton}
                        activeOpacity={0.7}
                    >
                        <X size={18} color="#E95322" />
                    </TouchableOpacity>
                </View>

                <View style={styles.discountRow}>
                    <Text style={styles.discountLabel}>{appliedVoucher.voucher.name}</Text>
                    <Text style={styles.discountValue}>
                        -${appliedVoucher.discount_amount.toFixed(2)}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!isExpanded ? (
                <TouchableOpacity
                    onPress={() => setIsExpanded(true)}
                    style={styles.collapseButton}
                    activeOpacity={0.8}
                >
                    <Ticket size={20} color="#E95322" />
                    <Text style={styles.collapseButtonText}>Apply Voucher</Text>
                    <Feather name="chevron-right" size={20} color="#E95322" />
                </TouchableOpacity>
            ) : (
                <View style={styles.expandedContainer}>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Ticket size={18} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter voucher code"
                                placeholderTextColor="#9CA3AF"
                                value={voucherCode}
                                onChangeText={setVoucherCode}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                editable={!voucherValidating}
                            />
                            {voucherCode.length > 0 && !voucherValidating && (
                                <TouchableOpacity
                                    onPress={() => setVoucherCode('')}
                                    style={styles.clearButton}
                                >
                                    <X size={16} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleApplyVoucher}
                            style={[
                                styles.applyButton,
                                (!voucherCode.trim() || voucherValidating) && styles.applyButtonDisabled,
                            ]}
                            disabled={!voucherCode.trim() || voucherValidating}
                            activeOpacity={0.8}
                        >
                            {voucherValidating ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.applyButtonText}>Apply</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setIsExpanded(false);
                                setVoucherCode('');
                            }}
                            style={styles.cancelButton}
                            activeOpacity={0.7}
                        >
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {voucherError && (
                        <View style={styles.errorContainer}>
                            <AlertCircle size={16} color="#EF4444" />
                            <Text style={styles.errorText}>{voucherError}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    collapseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFF5E6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE3D6',
        borderStyle: 'dashed',
    },
    collapseButtonText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#E95322',
        marginLeft: 10,
    },
    expandedContainer: {
        gap: 8,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        textTransform: 'uppercase',
    },
    clearButton: {
        padding: 4,
    },
    applyButton: {
        backgroundColor: '#E95322',
        paddingHorizontal: 20,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    applyButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    cancelButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444',
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '500',
    },
    appliedContainer: {
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#10B981',
        padding: 14,
        gap: 12,
    },
    appliedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appliedIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appliedInfo: {
        flex: 1,
    },
    appliedLabel: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '600',
        marginBottom: 2,
    },
    appliedCode: {
        fontSize: 16,
        color: '#047857',
        fontWeight: '800',
        letterSpacing: 1,
    },
    removeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#A7F3D0',
        borderStyle: 'dashed',
    },
    discountLabel: {
        fontSize: 14,
        color: '#047857',
        fontWeight: '600',
    },
    discountValue: {
        fontSize: 16,
        color: '#10B981',
        fontWeight: '800',
    },
});
