import React, { useState } from 'react';
import { View, Text, Input, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { splitString, smartSplit, demonstrateStringSplit } from '../../utils/stringUtils';
import './index.scss';

/**
 * 字符串拆分页面
 * 演示和测试字符串拆分功能
 */
const StringSplitPage: React.FC = () => {
    const [str1, setStr1] = useState('Elle Girl aa8B ElleGirl ccddelliegirLEF');
    const [str2, setStr2] = useState('Elle Girl');
    const [result, setResult] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    
    // 本地拆分
    const handleLocalSplit = () => {
        try {
            const splitResult = splitString(str1, str2);
            setResult(splitResult);
            
            Taro.showToast({
                title: '本地拆分成功',
                icon: 'success'
            });
        } catch (error) {
            console.error('本地拆分失败:', error);
            Taro.showToast({
                title: '拆分失败',
                icon: 'error'
            });
        }
    };
    
    // 调用后端API拆分
    const handleApiSplit = async () => {
        setLoading(true);
        try {
            const response = await Taro.request({
                url: 'http://localhost:8080/api/string/split',
                method: 'POST',
                data: {
                    str1,
                    str2
                },
                header: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                setResult(response.data.data);
                Taro.showToast({
                    title: 'API拆分成功',
                    icon: 'success'
                });
            } else {
                throw new Error(response.data.message || 'API调用失败');
            }
        } catch (error) {
            console.error('API拆分失败:', error);
            Taro.showToast({
                title: 'API调用失败',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    // 演示功能
    const handleDemo = () => {
        demonstrateStringSplit();
        
        // 使用演示数据
        const demoResult = splitString(
            'Elle Girl aa8B ElleGirl ccddelliegirLEF',
            'Elle Girl'
        );
        setResult(demoResult);
        
        Taro.showToast({
            title: '演示完成',
            icon: 'success'
        });
    };
    
    // 清空结果
    const handleClear = () => {
        setResult([]);
        setStr1('Elle Girl aa8B ElleGirl ccddelliegirLEF');
        setStr2('Elle Girl');
    };
    
    return (
        <View className="string-split-page">
            <View className="header">
                <Text className="title">字符串拆分工具</Text>
                <Text className="subtitle">根据图片示例实现的字符串拆分功能</Text>
            </View>
            
            <View className="input-section">
                <View className="input-group">
                    <Text className="label">字符串1 (待拆分):</Text>
                    <Textarea
                        className="input-text"
                        value={str1}
                        onInput={(e) => setStr1(e.detail.value)}
                        placeholder="请输入要拆分的字符串"
                        maxlength={1000}
                    />
                </View>
                
                <View className="input-group">
                    <Text className="label">字符串2 (分隔符):</Text>
                    <Input
                        className="input-text"
                        value={str2}
                        onInput={(e) => setStr2(e.detail.value)}
                        placeholder="请输入分隔符"
                    />
                </View>
            </View>
            
            <View className="button-section">
                <Button 
                    className="btn btn-primary" 
                    onClick={handleLocalSplit}
                    disabled={!str1 || !str2}
                >
                    本地拆分
                </Button>
                
                <Button 
                    className="btn btn-secondary" 
                    onClick={handleApiSplit}
                    loading={loading}
                    disabled={!str1 || !str2}
                >
                    API拆分
                </Button>
                
                <Button 
                    className="btn btn-demo" 
                    onClick={handleDemo}
                >
                    演示示例
                </Button>
                
                <Button 
                    className="btn btn-clear" 
                    onClick={handleClear}
                >
                    清空重置
                </Button>
            </View>
            
            <View className="result-section">
                <Text className="result-title">拆分结果:</Text>
                {result.length > 0 ? (
                    <View className="result-list">
                        {result.map((item, index) => (
                            <View key={index} className="result-item">
                                <Text className="result-index">[{index}]</Text>
                                <Text className="result-text">"{item}"</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text className="no-result">暂无拆分结果</Text>
                )}
            </View>
            
            <View className="example-section">
                <Text className="example-title">示例说明:</Text>
                <View className="example-content">
                    <Text className="example-text">
                        输入: "Elle Girl aa8B ElleGirl ccddelliegirLEF"
                    </Text>
                    <Text className="example-text">
                        分隔符: "Elle Girl"
                    </Text>
                    <Text className="example-text">
                        结果: ["aa8B", "ccddelliegirLEF"]
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default StringSplitPage;