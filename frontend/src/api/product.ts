import { request } from '@/utils/request';
import { Product } from '@/models/product';

export const getProducts = async () => {
  return [
    { id: 1, name: '美白面膜', price: 99, img: '', desc: '补水保湿，提亮肤色' },
    { id: 2, name: '玻尿酸精华', price: 199, img: '', desc: '深层补水，紧致肌肤' },
    { id: 3, name: '防晒霜', price: 129, img: '', desc: '清爽不油腻，强力防晒' }
  ];
};