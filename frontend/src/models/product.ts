export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string;
}

export interface CartItem {
    productId: number;
    quantity: number;
    productName: string;
    price: number;
}

export interface OrderCreateRequest {
    items: CartItem[];
}