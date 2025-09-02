import Taro from '@tarojs/taro';

const SESSION_KEY = 'shopping_session_id';

export const getSessionId = (): string => {
    let sessionId = Taro.getStorageSync(SESSION_KEY);
    
    if (!sessionId) {
        sessionId = generateSessionId();
        Taro.setStorageSync(SESSION_KEY, sessionId);
    }
    
    return sessionId;
};

export const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const clearSession = (): void => {
    Taro.removeStorageSync(SESSION_KEY);
};