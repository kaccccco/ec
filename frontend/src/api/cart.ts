import { request } from '@/utils/request';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/models/product';

export const getCart = async (sessionId: string): Promise<Cart> => {
    return request<Cart>({
        url: `/cart/${sessionId}`,
        method: 'GET',
    });
};

export const addToCart = async (requestData: AddToCartRequest): Promise<Cart> => {
    return request<Cart>({
        url: '/cart/add',
        method: 'POST',
        data: requestData,
    });
};

export const updateCartItem = async (
    sessionId: string, 
    productId: number, 
    requestData: UpdateCartItemRequest
): Promise<Cart> => {
    return request<Cart>({
        url: `/cart/${sessionId}/items/${productId}`,
        method: 'PUT',
        data: requestData,
    });
};

export const removeFromCart = async (sessionId: string, productId: number): Promise<void> => {
    return request<void>({
        url: `/cart/${sessionId}/items/${productId}`,
        method: 'DELETE',
    });
};

export const clearCart = async (sessionId: string): Promise<void> => {
    return request<void>({
        url: `/cart/${sessionId}`,
        method: 'DELETE',
    });
};