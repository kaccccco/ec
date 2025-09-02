export interface OrderItem {
    id?: number;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface Order {
    id: number;
    sessionId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateOrderFromCartRequest {
    sessionId: string;
}

export interface CreateOrderRequest {
    productId: number;
    quantity: number;
}