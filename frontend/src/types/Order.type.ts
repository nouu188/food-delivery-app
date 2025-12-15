export type OrderStatus = "active" | "completed" | "cancelled";

export interface Order {
    id: string;
    name: string;
    imageUri: string;
    date: string;
    price: number;
    itemCount: number;
    status: OrderStatus;
}
