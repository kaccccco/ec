# E-commerce Backend

基于 Spring Boot 3.0+、Redis 和 MySQL 的电商后端 API 服务。

## 技术栈

- Java 17+
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Data Redis
- MySQL 8.0
- Redis 6.0+
- OpenAPI 3.0 (Swagger)
- Maven

## API 端点

### 产品相关

#### 获取所有产品
```bash
GET /products
```
返回产品列表，包含 id、name、price、stock 字段。

响应示例：
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "price": 7999.00,
    "stock": 100
  },
  {
    "id": 2,
    "name": "MacBook Pro",
    "price": 12999.00,
    "stock": 50
  }
]
```

### 订单相关

#### 创建订单
```bash
POST /orders
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

功能：
- 检查库存是否充足
- 如果成功，减少库存
- 返回订单ID和总价

响应示例：
```json
{
  "id": 1,
  "productId": 1,
  "productName": "iPhone 15",
  "quantity": 2,
  "totalPrice": 15998.00,
  "createdAt": "2023-12-01T10:30:00"
}
```

#### 获取订单详情（可选）
```bash
GET /orders/{id}
```
返回订单的详细信息。

## 快速开始

### 前置要求

- Java 17 或更高版本
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+

### 运行步骤

1. 启动 MySQL 和 Redis 服务

2. 创建数据库并执行初始化脚本：
```bash
mysql -u root -p < src/main/resources/db/init.sql
```

3. 更新配置文件中的数据库连接信息

4. 运行应用：
```bash
mvn spring-boot:run
```

## 示例 API 调用

### 使用 curl

1. 获取所有产品：
```bash
curl -X GET http://localhost:8080/products
```

2. 创建订单：
```bash
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

3. 获取订单详情：
```bash
curl -X GET http://localhost:8080/orders/1
```

## 技术特性

- **数据一致性**: Redis 原子性操作确保库存准确性
- **并发控制**: 分布式锁防止库存超卖
- **缓存机制**: Redis 缓存提高查询性能
- **自动回滚**: 订单创建失败时自动恢复库存

## 项目结构 