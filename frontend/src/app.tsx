import React, { useEffect } from 'react';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import './app.scss';

function App(props) {
    // 小程序启动时的初始化逻辑
    useEffect(() => {
        console.log('App launched');

        // 设置全局默认配置
        Taro.setBackgroundColor({
            backgroundColor: '#f5f5f5',
            backgroundColorTop: '#f5f5f5',
            backgroundColorBottom: '#f5f5f5',
        });
    }, []);

    // 小程序显示时的逻辑
    useDidShow(() => {
        console.log('App showed');
    });

    // 小程序隐藏时的逻辑
    useDidHide(() => {
        console.log('App hidden');
    });

    return (
        // 渲染子组件
        <React.Fragment>
            {props.children}
        </React.Fragment>
    );
}

export default App;