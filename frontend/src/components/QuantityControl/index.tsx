import React from 'react';
import { View, Button, Text } from '@tarojs/components';
import './index.scss';

interface QuantityControlProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
                                                             value,
                                                             min = 0,
                                                             max = Infinity,
                                                             onChange
                                                         }) => {
    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    return (
        <View className="quantity-control">
            <Button
                className="btn decrease"
                onClick={handleDecrease}
                disabled={value <= min}
            >
                -
            </Button>
            <Text className="value">{value}</Text>
            <Button
                className="btn increase"
                onClick={handleIncrease}
                disabled={value >= max}
            >
                +
            </Button>
        </View>
    );
};

export default QuantityControl;