import { request } from '@/utils/request';
import { Product } from '@/models/product';

export const getProducts = async (): Promise<Product[]> => {
    return request<Product[]>({
        url: '/products',
        method: 'GET',
    });
};

export const getProduct = async (id: number): Promise<Product> => {
    return request<Product>({
        url: `/products/${id}`,
        method: 'GET',
    });
};