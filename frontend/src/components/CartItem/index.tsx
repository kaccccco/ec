import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import QuantityControl from '../QuantityControl';
import { CartItem as CartItemType } from '@/models/product';
import './index.scss';

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
    disabled?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
    item,
    onQuantityChange,
    onRemove,
    disabled = false
}) => {
    return (
        <View className="cart-item">
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
                    onChange={(quantity) => onQuantityChange(item.productId, quantity)}
                    disabled={disabled}
                />
                <Button 
                    className="remove-button"
                    size="mini"
                    onClick={() => onRemove(item.productId)}
                    disabled={disabled}
                >
                    删除
                </Button>
            </View>
        </View>
    );
};

export default CartItem;