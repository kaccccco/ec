import Taro from '@tarojs/taro';

// 根据实际情况修改后端地址
const BASE_URL = 'http://localhost:8080';

export const request = async <T>(options: Taro.request.Option): Promise<T> => {
    try {
        const response = await Taro.request({
            ...options,
            url: `${BASE_URL}${options.url}`,
            header: {
                'Content-Type': 'application/json',
                ...options.header,
            },
        });

        if (response.statusCode >= 200 && response.statusCode < 300) {
            return response.data as T;
        }

        throw new Error(`Request failed with status ${response.statusCode}`);
    } catch (error) {
        console.error('API request error:', error);
        Taro.showToast({
            title: '网络请求失败',
            icon: 'none'
        });
        throw error;
    }
};