import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import OrderConfirmation from '@/components/OrderConfirmation';
import { getOrder } from '@/api';
import { Order, OrderItem } from '@/models/order';
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
            <View className="order-header">
                <Text className="order-title">订单详情</Text>
                <Text className="order-id">订单号: {order.id}</Text>
                <Text className="order-status">状态: {order.status}</Text>
            </View>

            <View className="order-items">
                <Text className="section-title">商品清单</Text>
                {order.items.map((item: OrderItem, index: number) => (
                    <View key={index} className="order-item">
                        <View className="item-info">
                            <Text className="item-name">{item.productName}</Text>
                            <Text className="item-price">¥{item.productPrice.toFixed(2)}</Text>
                            <Text className="item-quantity">数量: {item.quantity}</Text>
                        </View>
                        <View className="item-total">
                            <Text className="total-price">¥{item.totalPrice.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View className="order-summary">
                <View className="summary-row">
                    <Text className="label">商品总数:</Text>
                    <Text className="value">{order.items.reduce((sum, item) => sum + item.quantity, 0)} 件</Text>
                </View>
                <View className="summary-row total">
                    <Text className="label">订单总额:</Text>
                    <Text className="value">¥{order.totalAmount.toFixed(2)}</Text>
                </View>
            </View>

            <View className="order-actions">
                <Button className="back-button" onClick={handleBackToHome}>
                    返回首页
                </Button>
                <Button 
                    className="continue-shopping-button" 
                    onClick={() => Taro.navigateBack()}
                >
                    继续购物
                </Button>
            </View>
        </View>
    );
};

export default OrderPage;