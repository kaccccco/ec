import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import './index.scss';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    retryText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
    message, 
    onRetry, 
    retryText = '重试' 
}) => {
    return (
        <View className="error-message-component">
            <Text className="error-icon">⚠️</Text>
            <Text className="error-text">{message}</Text>
            {onRetry && (
                <Button className="retry-button" onClick={onRetry}>
                    {retryText}
                </Button>
            )}
        </View>
    );
};

export default ErrorMessage;