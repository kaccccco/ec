import { request } from '@/utils/request';
import { Order, OrderCreateRequest } from '@/models/order';

export const createOrder = async (requestData) => {
  return {
    id: Math.floor(Math.random() * 10000),
    items: requestData.items,
    status: '已创建',
    total: requestData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
};

export const getOrder = async (id: number): Promise<Order> => {
    return request<Order>({
        url: `/orders/${id}`,
        method: 'GET',
    });
};