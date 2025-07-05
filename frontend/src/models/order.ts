export interface Order {
    id: number;
    createdAt: string;
    totalAmount: number;
    items: {
        productId: number;
        productName: string;
        price: number;
        quantity: number;
    }[];
}