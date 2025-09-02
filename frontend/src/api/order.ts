import { request } from '@/utils/request';
import { Order, CreateOrderRequest, CreateOrderFromCartRequest } from '@/models/order';

export const createOrder = async (requestData: CreateOrderRequest): Promise<Order> => {
    return request<Order>({
        url: '/orders',
        method: 'POST',
        data: requestData,
    });
};

export const createOrderFromCart = async (requestData: CreateOrderFromCartRequest): Promise<Order> => {
    return request<Order>({
        url: '/orders/from-cart',
        method: 'POST',
        data: requestData,
    });
};

export const getOrder = async (id: number): Promise<Order> => {
    return request<Order>({
        url: `/orders/${id}`,
        method: 'GET',
    });
};

export const getOrdersBySession = async (sessionId: string): Promise<Order[]> => {
    return request<Order[]>({
        url: `/orders/session/${sessionId}`,
        method: 'GET',
    });
};