import { create } from "zustand";
import { produce } from "immer"; // giúp update state an toàn, clean code
import orderService from "@/services/api/order.service";
import { Order, OrderStatus, CreateOrderRequest, CancelledBy } from "@/types/api/order";

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;

    fetchOrders: (status?: OrderStatus) => Promise<void>;
    fetchOrderById: (id: string) => Promise<Order>;
    createOrder: (data: CreateOrderRequest) => Promise<Order>;
    cancelOrder: (orderId: string, reason: string) => Promise<void>;
    reorder: (orderId: string) => Promise<Order>;
    setOrders: (orders: Order[]) => void;
    getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async (status?: OrderStatus) => {
        set({ isLoading: true, error: null });
        try {
            const response = await orderService.getOrders({ status });
            const orders = response?.items && Array.isArray(response.items) ? response.items : [];
            set({ orders, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, orders: [] });
        }
    },

    fetchOrderById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const order = await orderService.getOrderById(id);
            set({ isLoading: false });
            return order;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    createOrder: async (data: CreateOrderRequest) => {
        set({ isLoading: true, error: null });
        try {
            const order = await orderService.createOrder(data);
            set(
                produce((state: OrderState) => {
                    state.orders.unshift(order); 
                    state.isLoading = false;
                })
            );
            return order;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    cancelOrder: async (orderId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
            await orderService.cancelOrder(orderId, {
                cancellation_reason: reason,
                cancelled_by: CancelledBy.CUSTOMER,
            });

            set(
                produce((state: OrderState) => {
                    const order = state.orders.find((o) => o.id === orderId);
                    if (order) {
                        order.status = OrderStatus.CANCELLED;
                        order.cancellation_reason = reason;
                        order.cancelled_at = new Date().toISOString();
                    }
                    state.isLoading = false;
                })
            );
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    reorder: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
            const newOrder = await orderService.reorder(orderId);
            set(
                produce((state: OrderState) => {
                    state.orders.unshift(newOrder);
                    state.isLoading = false;
                })
            );
            return newOrder;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearOrders: () => set({ orders: [] }),

    setOrders: (orders) => set({ orders }),

    getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
    },
}));
