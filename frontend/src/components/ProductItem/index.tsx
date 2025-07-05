import React from 'react';
import { View, Text } from '@tarojs/components';
import QuantityControl from '../QuantityControl';
import { Product } from '@/models/product';
import './index.scss';

interface ProductItemProps {
    product: Product;
    quantity: number;
    onQuantityChange: (productId: number, quantity: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
                                                     product,
                                                     quantity,
                                                     onQuantityChange
                                                 }) => {
    return (
        <View className="product-item">
            <View className="info">
                <Text className="name">{product.name}</Text>
                <Text className="price">¥{product.price.toFixed(2)}</Text>
                <Text className="stock">库存: {product.stock}</Text>
                {product.description && (
                    <Text className="description">{product.description}</Text>
                )}
            </View>

            <View className="actions">
                <QuantityControl
                    value={quantity}
                    max={product.stock}
                    onChange={(value) => onQuantityChange(product.id, value)}
                />
            </View>
        </View>
    );
};

export default ProductItem;