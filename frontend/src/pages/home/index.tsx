import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ProductItem from '@/components/ProductItem';
import { getProducts, addToCart, getCart } from '@/api';
import { Product, Cart } from '@/models/product';
import { getSessionId } from '@/utils/session';
import './index.scss';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<number | null>(null);

    const sessionId = getSessionId();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 并行获取商品和购物车数据
            const [productsData, cartData] = await Promise.all([
                getProducts(),
                getCart(sessionId).catch(() => ({ 
                    sessionId, 
                    items: [], 
                    totalAmount: 0, 
                    totalItems: 0 
                }))
            ]);
            
            setProducts(productsData);
            setCart(cartData);
        } catch (err) {
            setError('加载数据失败，请稍后再试');
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: number, quantity: number) => {
        if (addingToCart === productId || quantity <= 0) return;

        try {
            setAddingToCart(productId);
            
            const updatedCart = await addToCart({
                sessionId,
                productId,
                quantity
            });
            
            setCart(updatedCart);
            
            Taro.showToast({
                title: '已添加到购物车',
                icon: 'success',
                duration: 1500
            });
        } catch (err) {
            console.error('Failed to add to cart:', err);
            Taro.showToast({
                title: '添加失败',
                icon: 'error',
                duration: 1500
            });
        } finally {
            setAddingToCart(null);
        }
    };

    const handleGoToCart = () => {
        Taro.navigateTo({
            url: '/pages/cart/index'
        });
    };

    const getCartQuantityForProduct = (productId: number): number => {
        if (!cart) return 0;
        const item = cart.items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };

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
                        onClick={fetchData}
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
                {cart && cart.totalItems > 0 && (
                    <Button className="cart-button" onClick={handleGoToCart}>
                        购物车 ({cart.totalItems})
                    </Button>
                )}
            </View>

            <View className="product-list">
                {products.map(product => (
                    <View key={product.id} className="product-card">
                        <View className="product-info">
                            <Text className="product-name">{product.name}</Text>
                            <Text className="product-price">¥{product.price.toFixed(2)}</Text>
                            <Text className="product-stock">库存: {product.stock}</Text>
                            {product.description && (
                                <Text className="product-description">{product.description}</Text>
                            )}
                        </View>
                        <View className="product-actions">
                            <Text className="cart-quantity">
                                购物车中: {getCartQuantityForProduct(product.id)} 件
                            </Text>
                            <Button
                                className="add-to-cart-button"
                                onClick={() => handleAddToCart(product.id, 1)}
                                disabled={addingToCart === product.id || product.stock <= 0}
                            >
                                {addingToCart === product.id ? '添加中...' : '加入购物车'}
                            </Button>
                        </View>
                    </View>
                ))}
            </View>

            {cart && cart.totalItems > 0 && (
                <View className="cart-summary">
                    <View className="summary-info">
                        <Text className="summary-text">
                            购物车: {cart.totalItems} 件商品，合计 ¥{cart.totalAmount.toFixed(2)}
                        </Text>
                    </View>
                    <Button className="view-cart-button" onClick={handleGoToCart}>
                        查看购物车
                    </Button>
                </View>
            )}
        </View>
    );
};

export default HomePage;