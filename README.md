# 购物车订单系统 (Shopping Cart Order System)

这是一个完整的电商购物车订单系统，包含前端（Taro + React）和后端（Spring Boot + MySQL + Redis）。

## 功能特性

### 后端功能
- ✅ 商品管理（产品列表、库存管理）
- ✅ 购物车管理（添加、更新、删除商品）
- ✅ 订单管理（从购物车创建订单、订单查询）
- ✅ Redis 缓存（商品缓存、购物车会话管理）
- ✅ 库存锁定机制（防止超卖）
- ✅ RESTful API 设计
- ✅ Swagger API 文档

### 前端功能
- ✅ 商品展示页面
- ✅ 购物车管理页面
- ✅ 订单确认页面
- ✅ 会话管理（购物车持久化）
- ✅ 响应式设计
- ✅ 错误处理和加载状态

## 技术栈

### 后端
- **Spring Boot 3.2.0** - 主框架
- **Spring Data JPA** - 数据访问层
- **Spring Data Redis** - 缓存层
- **MySQL 8.0** - 主数据库
- **Redis 7** - 缓存数据库
- **Lombok** - 代码简化
- **Swagger/OpenAPI 3** - API 文档
- **Maven** - 依赖管理

### 前端
- **Taro 3.6.24** - 跨平台框架
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **SCSS** - 样式预处理

## 快速开始

### 1. 启动数据库服务

```bash
cd backend
docker-compose up -d
```

这将启动 MySQL 和 Redis 服务。

### 2. 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动。

API 文档地址: http://localhost:8080/swagger-ui.html

### 3. 启动前端服务

```bash
cd frontend
npm install
npm run dev:h5
```

前端服务将在 http://localhost:10086 启动。

## API 接口

### 商品管理
- `GET /products` - 获取所有商品
- `GET /products/{id}` - 获取单个商品详情

### 购物车管理
- `GET /cart/{sessionId}` - 获取购物车
- `POST /cart/add` - 添加商品到购物车
- `PUT /cart/{sessionId}/items/{productId}` - 更新购物车商品数量
- `DELETE /cart/{sessionId}/items/{productId}` - 从购物车删除商品
- `DELETE /cart/{sessionId}` - 清空购物车

### 订单管理
- `POST /orders` - 创建单商品订单
- `POST /orders/from-cart` - 从购物车创建订单
- `GET /orders/{id}` - 获取订单详情
- `GET /orders/session/{sessionId}` - 获取会话的所有订单

## 数据库设计

### 主要表结构

1. **products** - 商品表
   - id, name, price, stock, description

2. **carts** - 购物车表
   - id, session_id, created_at, updated_at

3. **cart_items** - 购物车商品表
   - id, cart_id, product_id, product_name, product_price, quantity

4. **orders** - 订单表
   - id, session_id, total_amount, status, created_at, updated_at

5. **order_items** - 订单商品表
   - id, order_id, product_id, product_name, product_price, quantity

## 系统架构

```
Frontend (Taro/React)
       ↓
   REST APIs
       ↓
Backend (Spring Boot)
       ↓
   ┌─────────────┬─────────────┐
   ↓             ↓             ↓
MySQL         Redis        Cache
(主数据)      (会话/缓存)    (应用缓存)
```

## 核心特性

### 1. 购物车会话管理
- 使用 sessionId 标识用户会话
- Redis 缓存购物车数据，2小时过期
- 数据库持久化保证数据不丢失

### 2. 库存管理
- Redis 原子操作防止超卖
- 分布式锁机制保证并发安全
- 库存扣减失败自动回滚

### 3. 订单流程
1. 用户添加商品到购物车
2. 在购物车页面调整商品数量
3. 点击结算创建订单
4. 系统检查库存并扣减
5. 清空购物车，跳转订单详情

### 4. 缓存策略
- 商品信息缓存1小时
- 购物车缓存2小时
- 订单缓存24小时
- 缓存失效时自动从数据库加载

## 开发说明

### 后端开发
- 遵循 RESTful API 设计原则
- 使用 DTO 模式进行数据传输
- 统一异常处理和日志记录
- 数据库事务保证数据一致性

### 前端开发
- 组件化开发，可复用性强
- 统一状态管理和错误处理
- 响应式设计，适配多端
- TypeScript 提供类型安全

## 测试

### 后端测试
```bash
cd backend
mvn test
```

### 前端测试
```bash
cd frontend
npm run test
```

## 生产部署

### 后端部署
1. 构建 JAR 包: `mvn clean package`
2. 配置生产环境数据库连接
3. 部署到服务器: `java -jar target/ecommerce-backend-1.0.0.jar`

### 前端部署
1. 构建生产版本: `npm run build:h5`
2. 部署 dist 目录到 Web 服务器

## 许可证

MIT License