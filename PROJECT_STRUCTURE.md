# 项目结构说明

## 📁 整体结构

```
shopping-cart-system/
├── 📂 backend/                 # Spring Boot 后端
│   ├── 📂 src/main/java/com/ec/
│   │   ├── 📂 entity/          # 数据实体
│   │   │   ├── Product.java    # 商品实体
│   │   │   ├── Cart.java       # 购物车实体
│   │   │   ├── CartItem.java   # 购物车商品实体
│   │   │   ├── Order.java      # 订单实体
│   │   │   ├── OrderItem.java  # 订单商品实体
│   │   │   └── OrderStatus.java # 订单状态枚举
│   │   ├── 📂 repository/      # 数据访问层
│   │   │   ├── ProductRepository.java
│   │   │   ├── CartRepository.java
│   │   │   ├── CartItemRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   └── OrderItemRepository.java
│   │   ├── 📂 service/         # 业务逻辑层
│   │   │   ├── ProductService.java
│   │   │   ├── CartService.java
│   │   │   ├── OrderService.java
│   │   │   ├── OrderFacadeService.java
│   │   │   ├── RedisService.java
│   │   │   └── StockLockService.java
│   │   ├── 📂 controller/      # 控制器层
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   └── OrderController.java
│   │   ├── 📂 dto/             # 数据传输对象
│   │   │   ├── CartDTO.java
│   │   │   ├── CartItemDTO.java
│   │   │   ├── AddToCartRequest.java
│   │   │   ├── UpdateCartItemRequest.java
│   │   │   ├── CreateOrderRequest.java
│   │   │   └── CreateOrderFromCartRequest.java
│   │   ├── 📂 config/          # 配置类
│   │   │   └── CacheConfig.java
│   │   └── EcommerceApplication.java # 主启动类
│   ├── 📂 src/main/resources/
│   │   ├── application.yml     # 应用配置
│   │   └── schema.sql         # 数据库初始化脚本
│   ├── docker-compose.yml     # Docker 服务配置
│   └── pom.xml               # Maven 配置
├── 📂 frontend/               # Taro + React 前端
│   ├── 📂 src/
│   │   ├── 📂 pages/          # 页面组件
│   │   │   ├── 📂 home/       # 首页 - 商品列表
│   │   │   ├── 📂 cart/       # 购物车页面
│   │   │   └── 📂 order/      # 订单详情页面
│   │   ├── 📂 components/     # 可复用组件
│   │   │   ├── 📂 ProductItem/      # 商品项组件
│   │   │   ├── 📂 CartItem/         # 购物车项组件
│   │   │   ├── 📂 QuantityControl/  # 数量控制组件
│   │   │   ├── 📂 OrderConfirmation/ # 订单确认组件
│   │   │   ├── 📂 Loading/          # 加载组件
│   │   │   └── 📂 ErrorMessage/     # 错误消息组件
│   │   ├── 📂 api/            # API 接口
│   │   │   ├── product.ts     # 商品 API
│   │   │   ├── cart.ts        # 购物车 API
│   │   │   ├── order.ts       # 订单 API
│   │   │   └── index.ts       # API 统一导出
│   │   ├── 📂 models/         # 数据模型
│   │   │   ├── product.ts     # 商品和购物车模型
│   │   │   └── order.ts       # 订单模型
│   │   ├── 📂 utils/          # 工具函数
│   │   │   ├── request.ts     # HTTP 请求工具
│   │   │   └── session.ts     # 会话管理工具
│   │   ├── app.config.ts      # 应用配置
│   │   ├── app.scss          # 全局样式
│   │   └── app.tsx           # 应用入口
│   ├── package.json          # 前端依赖配置
│   └── tsconfig.json         # TypeScript 配置
├── 📄 README.md              # 项目说明文档
├── 📄 PROJECT_STRUCTURE.md   # 项目结构说明
├── 🚀 start.sh              # 一键启动脚本
├── ⚙️ setup-dev.sh          # 开发环境设置脚本
└── 🧪 test-api.sh           # API 测试脚本
```

## 🔄 数据流程

### 购物车流程
1. **添加商品** → CartController.addToCart → CartService.addToCart → 数据库 + Redis
2. **查看购物车** → CartController.getCart → CartService.getCart → Redis/数据库
3. **更新数量** → CartController.updateCartItem → CartService.updateCartItem → 数据库 + Redis
4. **删除商品** → CartController.removeFromCart → CartService.removeFromCart → 数据库 + Redis

### 订单流程
1. **创建订单** → OrderController.createOrderFromCart → OrderFacadeService → OrderService + CartService
2. **库存检查** → ProductService.hasEnoughStock → Redis/数据库
3. **库存扣减** → ProductService.updateStock → Redis + 数据库
4. **清空购物车** → CartService.clearCart → 数据库 + Redis

## 🎯 核心特性

### 1. 会话管理
- 前端生成唯一 sessionId
- 购物车与会话绑定
- 支持跨页面购物车状态保持

### 2. 缓存策略
- **商品缓存**: 1小时，提高查询性能
- **购物车缓存**: 2小时，快速访问
- **订单缓存**: 24小时，订单查询优化

### 3. 并发控制
- Redis 分布式锁防止库存超卖
- 原子操作保证数据一致性
- 事务回滚机制

### 4. 用户体验
- 实时库存显示
- 购物车数量提示
- 加载状态和错误处理
- 响应式设计

## 🔧 扩展建议

### 后端扩展
- [ ] 用户认证和授权
- [ ] 商品分类管理
- [ ] 优惠券系统
- [ ] 支付集成
- [ ] 订单状态流转
- [ ] 库存预警
- [ ] 数据统计分析

### 前端扩展
- [ ] 用户登录注册
- [ ] 商品搜索和筛选
- [ ] 商品详情页
- [ ] 订单历史列表
- [ ] 支付页面
- [ ] 个人中心
- [ ] 推送通知

### 架构扩展
- [ ] 微服务拆分
- [ ] 消息队列（订单异步处理）
- [ ] 分布式事务
- [ ] 监控和日志系统
- [ ] 容器化部署
- [ ] CI/CD 流水线