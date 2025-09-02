#!/bin/bash

echo "🚀 启动购物车订单系统..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 启动数据库服务
echo "📊 启动数据库服务..."
cd backend
docker-compose up -d

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 检查数据库连接
echo "🔍 检查数据库连接..."
until docker exec ecommerce-mysql mysqladmin ping -h"localhost" --silent; do
    echo "等待 MySQL 启动..."
    sleep 2
done

echo "✅ 数据库服务已启动"

# 启动后端服务
echo "🔧 启动后端服务..."
mvn spring-boot:run &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 15

# 启动前端服务
echo "🎨 启动前端服务..."
cd ../frontend
npm install
npm run dev:h5 &
FRONTEND_PID=$!

echo "🎉 系统启动完成！"
echo ""
echo "📱 前端地址: http://localhost:10086"
echo "🔧 后端地址: http://localhost:8080"
echo "📚 API 文档: http://localhost:8080/swagger-ui.html"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap 'echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID; docker-compose -f backend/docker-compose.yml down; exit' INT
wait