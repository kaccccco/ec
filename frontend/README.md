# 电子美妆商城前端（Taro + React）

本项目为美妆电商小程序/网页端前端，基于 Taro 3.6 + React 18 实现，支持 H5 端和小程序端构建，内置 mock 数据，适合本地开发和二次开发。

## 技术栈
- [Taro 3.6.24](https://taro.zone/)
- React 18
- TypeScript
- SCSS

## 目录结构
```
frontend/
├── config/           # Taro 各环境配置
├── src/
│   ├── api/          # API 接口与 mock 实现
│   ├── components/   # 复用组件
│   ├── models/       # TS 类型定义
│   ├── pages/        # 页面（home 首页、order 订单页）
│   ├── utils/        # 工具函数
│   ├── app.config.ts # Taro 全局页面配置
│   ├── app.tsx       # 应用入口
│   └── app.scss      # 全局样式
├── package.json      # 依赖与脚本
├── tsconfig.json     # TypeScript 配置
└── ...
```

## 主要页面
- `pages/home` 首页：商品列表、购物车、下单
- `pages/order` 订单页：订单详情、订单列表

## 主要组件
- `ProductItem` 商品卡片
- `QuantityControl` 数量选择器
- `OrderConfirmation` 订单确认弹窗

## Mock API 说明
- 所有商品、下单、订单数据均为 mock，见 `src/api/` 目录。
- `getProducts`/`createOrder`/`getOrderList` 等函数直接返回本地模拟数据，无需后端即可体验完整流程。

## 启动与开发
### 安装依赖
```bash
cd frontend
npm install
```

### 启动 H5 开发环境
```bash
npm run dev:h5
```
浏览器访问 http://localhost:10086

### 构建 H5 生产包
```bash
npm run build:h5
```

### 启动/构建小程序（如微信）
```bash
npm run dev:weapp
npm run build:weapp
```

## 常见问题
- **依赖冲突/缺包**：如遇 `Cannot find module` 或 `ERESOLVE`，请先 `npm install`，如仍有问题可尝试 `npm install --legacy-peer-deps`。
- **端口占用**：如 10086 端口被占用，可在 `config/dev.js` 修改。
- **mock 数据不生效**：请确保 `src/api/` 下的接口已被 mock（见本 README 上方说明）。

## 其他
- 如需对接真实后端，只需恢复 `src/api/` 下的真实接口实现。
- 页面样式和交互已适配美妆商城风格，可根据实际需求二次开发。

---
如有问题欢迎反馈！ 