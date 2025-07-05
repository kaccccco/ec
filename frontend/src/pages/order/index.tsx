import React, { useState, useEffect } from 'react';
import { View, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import OrderConfirmation from '@/components/OrderConfirmation';
import { getOrder } from '@/api';
import { Order } from '@/models/order';
import './index.scss';

const OrderPage: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const orderId = router.params.id ? parseInt(router.params.id, 10) : null;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('订单ID无效');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getOrder(orderId);
                setOrder(data);
            } catch (err) {
                setError('加载订单详情失败');
                console.error('Failed to load order:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleBackToHome = () => {
        Taro.reLaunch({ url: '/pages/home/index' });
    };

    if (loading) {
        return (
            <View className="order-page">
                <View className="loading-container">
                    <Text className="loading-text">加载订单详情中...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="order-page">
                <View className="error-container">
                    <Text className="error-message">{error}</Text>
                    <Button className="back-button" onClick={handleBackToHome}>
                        返回首页
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View className="order-page">
            {order ? (
                <OrderConfirmation order={order} />
            ) : (
                <View className="no-order">
                    <Text className="no-order-text">未找到订单信息</Text>
                    <Button className="back-button" onClick={handleBackToHome}>
                        返回首页
                    </Button>
                </View>
            )}
        </View>
    );
};

export default OrderPage;