import { Order } from '@/types/Order.type';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // 👈 thêm import

interface OrderCardProps {
  order: Order;
  onCancel: (orderId: string) => void;
  onReview: (orderId: string) => void;
  onReorder: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel, onReview, onReorder }) => {
  return (
    <View style={styles.card}>
      {/* Hình ảnh món */}
      <Image source={{ uri: order.imageUri }} style={styles.image} />

      {/* Thông tin chi tiết */}
      <View style={styles.detailsContainer}>
        {/* Tên món + Giá */}
        <View style={styles.row}>
          <Text style={styles.name}>{order.name}</Text>
          <Text style={styles.price}>${order.price.toFixed(2)}</Text>
        </View>

        {/* Ngày + số lượng items */}
        <View style={[styles.row, { marginTop: 4 }]}>
          <Text style={styles.date}>{order.date}</Text>
          <Text style={styles.items}>{order.itemCount} items</Text>
        </View>

        {/* Trạng thái Completed */}
        {order.status === 'completed' && (
          <>
            <Text style={styles.deliveredText}>✓ Order delivered</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => onReview(order.id)}
              >
                <Text style={styles.reviewButtonText}>Leave a review</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reorderButton}
                onPress={() => onReorder(order.id)}
              >
                <Text style={styles.reorderButtonText}>Order Again</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Trạng thái Active */}
        {order.status === 'active' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onCancel(order.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track Driver</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trạng thái Cancelled */}
        {order.status === 'cancelled' && (
          <View style={styles.statusRow}>
            <AntDesign name="close-circle" size={14} color="#E5634D" style={{ marginRight: 4 }} />
            <Text style={styles.cancelledText}>Order cancelled</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FFD8C7',
  },
  image: {
    width: 71,
    height: 108,
    borderRadius: 15,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E5634D',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  items: {
    fontSize: 13,
    color: '#888',
  },
  deliveredText: {
    fontSize: 13,
    color: '#E5634D',
    marginTop: 2,
  },
  cancelledText: {
    fontSize: 13,
    color: '#E5634D',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  // Active state
  cancelButton: {
    backgroundColor: '#E5634D',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  trackButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5634D',
  },
  trackButtonText: {
    color: '#E5634D',
    fontWeight: '600',
    fontSize: 13,
  },
  // Completed state
  reviewButton: {
    backgroundColor: '#E5634D',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  reorderButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5634D',
  },
  reorderButtonText: {
    color: '#E5634D',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default OrderCard;
