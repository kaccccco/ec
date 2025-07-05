import React, {useState, useEffect, Component} from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ProductItem from '@/components/ProductItem';
import { getProducts, createOrder } from '@/api';
import { Product, CartItem } from '@/models/product';
import './index.scss';

// pages/index/index.js
Component({
    data: {
        message: 'Hello, Taro!'
    },
    onReady() {
        console.log(this.data.message); // 应该正常输出信息
    }
})

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<Record<number, number>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data);

                // 初始化购物车
                const initialCart: Record<number, number> = {};
                data.forEach(product => {
                    initialCart[product.id] = 0;
                });
                setCart(initialCart);
            } catch (err) {
                setError('加载商品失败，请稍后再试');
                console.error('Failed to load products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleQuantityChange = (productId: number, quantity: number) => {
        setCart(prev => ({
            ...prev,
            [productId]: quantity
        }));
    };

    const handlePlaceOrder = async () => {
        // 构建订单项
        const items: CartItem[] = [];
        let totalItems = 0;

        Object.entries(cart).forEach(([productId, quantity]) => {
            if (quantity > 0) {
                const product = products.find(p => p.id === parseInt(productId, 10));
                if (product) {
                    items.push({
                        productId: product.id,
                        quantity,
                        productName: product.name,
                        price: product.price
                    });
                    totalItems += quantity;
                }
            }
        });

        if (totalItems === 0) {
            Taro.showToast({
                title: '请至少选择一件商品',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        try {
            Taro.showLoading({ title: '创建订单中...', mask: true });

            const order = await createOrder({ items });

            Taro.hideLoading();
            Taro.navigateTo({
                url: `/pages/order/index?id=${order.id}`
            });
        } catch (err) {
            Taro.hideLoading();
            Taro.showToast({
                title: '创建订单失败',
                icon: 'none',
                duration: 2000
            });
            console.error('Failed to create order:', err);
        }
    };

    const totalAmount = Object.entries(cart).reduce((sum, [productId, quantity]) => {
        if (quantity > 0) {
            const product = products.find(p => p.id === parseInt(productId, 10));
            if (product) {
                return sum + product.price * quantity;
            }
        }
        return sum;
    }, 0);

    const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

    if (loading) {
        return (
            <View className="home-page">
                <View className="loading-container">
                    <Text className="loading-text">加载商品中...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="home-page">
                <View className="error-container">
                    <Text className="error-message">{error}</Text>
                    <Button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        重新加载
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View className="home-page">
            <View className="header">
                <Text className="title">电子产品商城</Text>
                <Text className="subtitle">精选优质电子产品</Text>
            </View>

            <View className="product-list">
                {products.map(product => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        quantity={cart[product.id] || 0}
                        onQuantityChange={handleQuantityChange}
                    />
                ))}
            </View>

            <View className="cart-summary">
                <View className="summary-item">
                    <Text className="label">商品数量:</Text>
                    <Text className="value">{totalItems}件</Text>
                </View>
                <View className="summary-item">
                    <Text className="label">合计金额:</Text>
                    <Text className="value price">¥{totalAmount.toFixed(2)}</Text>
                </View>
            </View>

            <Button
                className="order-button"
                onClick={handlePlaceOrder}
                disabled={totalItems === 0}
            >
                提交订单
            </Button>
        </View>
    );
};

export default HomePage;