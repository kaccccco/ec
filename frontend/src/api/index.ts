export * from './product';
export * from './order';

// mock 商品列表
export function getProductList() {
  return Promise.resolve([
    { id: 1, name: '美白面膜', price: 99, img: '', desc: '补水保湿，提亮肤色' },
    { id: 2, name: '玻尿酸精华', price: 199, img: '', desc: '深层补水，紧致肌肤' },
    { id: 3, name: '防晒霜', price: 129, img: '', desc: '清爽不油腻，强力防晒' }
  ]);
}

// mock 订单列表
export function getOrderList() {
  return Promise.resolve([
    { id: 1, productName: '美白面膜', amount: 2, total: 198, status: '已发货' },
    { id: 2, productName: '玻尿酸精华', amount: 1, total: 199, status: '待付款' }
  ]);
}