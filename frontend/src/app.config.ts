export default {
    pages: [
        'pages/home/index',
        'pages/cart/index',
        'pages/order/index'
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#1890ff',
        navigationBarTitleText: '电子产品商城',
        navigationBarTextStyle: 'white',
        backgroundColor: '#f5f5f5',
        backgroundColorTop: '#f5f5f5',
        backgroundColorBottom: '#f5f5f5',
    },
    tabBar: {
        color: '#7A7E83',
        selectedColor: '#1890ff',
        backgroundColor: '#ffffff',
        list: [
            {
                pagePath: 'pages/home/index',
                text: '首页'
            },
            {
                pagePath: 'pages/cart/index',
                text: '购物车'
            },
            {
                pagePath: 'pages/order/index',
                text: '订单'
            }
        ]
    }
}