import React from 'react';
import { View, Text } from '@tarojs/components';
import { Order } from '@/models/order';
import './index.scss';

interface OrderConfirmationProps {
    order: Order;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
    const orderDate = new Date(order.createdAt);

    return (
        <View className="order-confirmation">
            <View className="header">
                <Text className="title">订单创建成功</Text>
                <Text className="subtitle">感谢您的购买！</Text>
            </View>

            <View className="order-details">
                <View className="detail-row">
                    <Text className="label">订单号:</Text>
                    <Text className="value">#{order.id}</Text>
                </View>
                <View className="detail-row">
                    <Text className="label">下单时间:</Text>
                    <Text className="value">{orderDate.toLocaleString()}</Text>
                </View>
                <View className="detail-row">
                    <Text className="label">总金额:</Text>
                    <Text className="value price">¥{order.totalAmount.toFixed(2)}</Text>
                </View>
            </View>

            <View className="order-items">
                <Text className="section-title">商品清单</Text>
                {order.items.map(item => (
                    <View key={`${item.productId}-${item.quantity}`} className="item">
                        <Text className="name">{item.productName}</Text>
                        <View className="details">
                            <Text className="quantity">x{item.quantity}</Text>
                            <Text className="price">¥{(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View className="actions">
                <Text className="hint">订单已处理，商品将尽快发货</Text>
            </View>
        </View>
    );
};

export default OrderConfirmation;