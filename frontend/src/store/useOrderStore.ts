// store/useOrderStore.ts
import { create } from "zustand";
import { produce } from "immer"; // giúp update state an toàn, clean code
import { Order, OrderStatus } from "@/types/Order.type";

// Mock data có thể move sang file riêng (data/mockOrders.ts)
const MOCK_ORDERS: Order[] = [
    {
        id: "1",
        name: "Strawberry shake",
        imageUri: "https://images.unsplash.com/photo-1572490122747-91a035221c27?q=80&w=1887&auto=format&fit=crop",
        date: "29 Nov, 01:20 pm",
        price: 20.0,
        itemCount: 2,
        status: "active",
    },
    {
        id: "2",
        name: "Classic Burger",
        imageUri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
        date: "28 Nov, 11:30 am",
        price: 15.5,
        itemCount: 1,
        status: "completed",
    },
    {
        id: "3",
        name: "Pepperoni Pizza",
        imageUri: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1928&auto=format&fit=crop",
        date: "27 Nov, 08:00 pm",
        price: 25.0,
        itemCount: 1,
        status: "cancelled",
    },
];

// Kiểu dữ liệu cho state
interface OrderState {
    orders: Order[];
    addOrder: (order: Omit<Order, "id">) => void;
    cancelOrder: (orderId: string) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    clearOrders: () => void;
    setOrders: (orders: Order[]) => void;
    getOrdersByStatus: (status: OrderStatus) => Order[];
}

// Store Zustand
export const useOrderStore = create<OrderState>((set, get) => ({
    orders: MOCK_ORDERS,

    addOrder: (order) =>
        set(
            produce((state: OrderState) => {
                state.orders.unshift({
                    ...order,
                    id: Date.now().toString(),
                });
            })
        ),

    cancelOrder: (orderId) =>
        set(
            produce((state: OrderState) => {
                const order = state.orders.find((o) => o.id === orderId);
                if (order) {
                    order.status = "cancelled";
                }
            })
        ),

    updateOrderStatus: (orderId, status) =>
        set(
            produce((state: OrderState) => {
                const order = state.orders.find((o) => o.id === orderId);
                if (order) {
                    order.status = status;
                }
            })
        ),

    clearOrders: () => set({ orders: [] }),

    setOrders: (orders) => set({ orders }),

    getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
    },
}));
