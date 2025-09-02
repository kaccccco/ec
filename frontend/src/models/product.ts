export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string;
}

export interface CartItem {
    id?: number;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface Cart {
    id?: number;
    sessionId: string;
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}

export interface AddToCartRequest {
    sessionId: string;
    productId: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}