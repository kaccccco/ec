import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import QuantityControl from '@/components/QuantityControl';
import { getCart, updateCartItem, removeFromCart, clearCart, createOrderFromCart } from '@/api';
import { Cart, CartItem } from '@/models/product';
import { getSessionId } from '@/utils/session';
import './index.scss';

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const sessionId = getSessionId();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const cartData = await getCart(sessionId);
            setCart(cartData);
        } catch (err) {
            setError('加载购物车失败，请稍后再试');
            console.error('Failed to load cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId: number, quantity: number) => {
        if (updating) return;
        
        try {
            setUpdating(true);
            const updatedCart = await updateCartItem(sessionId, productId, { quantity });
            setCart(updatedCart);
            
            Taro.showToast({
                title: '更新成功',
                icon: 'success',
                duration: 1500
            });
        } catch (err) {
            console.error('Failed to update cart item:', err);
            Taro.showToast({
                title: '更新失败',
                icon: 'error',
                duration: 1500
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = async (productId: number) => {
        if (updating) return;

        try {
            setUpdating(true);
            await removeFromCart(sessionId, productId);
            
            // 重新获取购物车数据
            await fetchCart();
            
            Taro.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
            });
        } catch (err) {
            console.error('Failed to remove item:', err);
            Taro.showToast({
                title: '删除失败',
                icon: 'error',
                duration: 1500
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleClearCart = async () => {
        if (updating) return;

        const result = await Taro.showModal({
            title: '确认清空',
            content: '确定要清空购物车吗？',
            confirmText: '确定',
            cancelText: '取消'
        });

        if (!result.confirm) return;

        try {
            setUpdating(true);
            await clearCart(sessionId);
            setCart({ id: 0, sessionId, items: [], totalAmount: 0, totalItems: 0 });
            
            Taro.showToast({
                title: '清空成功',
                icon: 'success',
                duration: 1500
            });
        } catch (err) {
            console.error('Failed to clear cart:', err);
            Taro.showToast({
                title: '清空失败',
                icon: 'error',
                duration: 1500
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleCheckout = async () => {
        if (updating || !cart || cart.items.length === 0) return;

        try {
            setUpdating(true);
            const order = await createOrderFromCart({ sessionId });
            
            Taro.showToast({
                title: '下单成功',
                icon: 'success',
                duration: 1500
            });

            // 跳转到订单详情页
            setTimeout(() => {
                Taro.navigateTo({
                    url: `/pages/order/index?id=${order.id}`
                });
            }, 1500);
            
        } catch (err) {
            console.error('Failed to create order:', err);
            Taro.showToast({
                title: '下单失败',
                icon: 'error',
                duration: 1500
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleBackToHome = () => {
        Taro.navigateBack();
    };

    if (loading) {
        return (
            <View className="cart-page">
                <View className="loading-container">
                    <Text className="loading-text">加载购物车中...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="cart-page">
                <View className="error-container">
                    <Text className="error-text">{error}</Text>
                    <Button className="retry-button" onClick={fetchCart}>
                        重试
                    </Button>
                </View>
            </View>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <View className="cart-page">
                <View className="empty-cart">
                    <Text className="empty-icon">🛒</Text>
                    <Text className="empty-text">购物车是空的</Text>
                    <Button className="back-button" onClick={handleBackToHome}>
                        去购物
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View className="cart-page">
            <View className="cart-content">
                <View className="cart-items">
                    {cart.items.map((item: CartItem) => (
                        <View key={item.productId} className="cart-item">
                            <View className="item-info">
                                <Text className="item-name">{item.productName}</Text>
                                <Text className="item-price">¥{item.productPrice.toFixed(2)}</Text>
                                <Text className="item-total">
                                    小计: ¥{item.totalPrice.toFixed(2)}
                                </Text>
                            </View>
                            <View className="item-actions">
                                <QuantityControl
                                    value={item.quantity}
                                    max={99} // 可以从产品信息获取真实库存
                                    onChange={(quantity) => handleQuantityChange(item.productId, quantity)}
                                />
                                <Button 
                                    className="remove-button"
                                    size="mini"
                                    onClick={() => handleRemoveItem(item.productId)}
                                >
                                    删除
                                </Button>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="cart-summary">
                    <View className="summary-row">
                        <Text className="label">商品数量:</Text>
                        <Text className="value">{cart.totalItems} 件</Text>
                    </View>
                    <View className="summary-row">
                        <Text className="label">总计:</Text>
                        <Text className="value">¥{cart.totalAmount.toFixed(2)}</Text>
                    </View>
                </View>

                <View className="cart-actions">
                    <Button 
                        className="action-button clear-button"
                        onClick={handleClearCart}
                        disabled={updating}
                    >
                        清空购物车
                    </Button>
                    <Button 
                        className="action-button checkout-button"
                        onClick={handleCheckout}
                        disabled={updating}
                    >
                        {updating ? '处理中...' : '立即下单'}
                    </Button>
                </View>
            </View>
        </View>
    );
};

export default CartPage;