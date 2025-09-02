#!/bin/bash

echo "🔧 设置开发环境..."

# 检查必要工具
echo "🔍 检查开发工具..."

if ! command -v java &> /dev/null; then
    echo "❌ Java 未安装，请安装 Java 17+"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven 未安装，请安装 Maven"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请安装 Node.js 16+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请安装 npm"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请安装 Docker"
    exit 1
fi

echo "✅ 开发工具检查完成"

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

echo "✅ 前端依赖安装完成"

# 构建后端项目
echo "🔨 构建后端项目..."
cd ../backend
mvn clean compile

if [ $? -ne 0 ]; then
    echo "❌ 后端项目构建失败"
    exit 1
fi

echo "✅ 后端项目构建完成"

echo ""
echo "🎉 开发环境设置完成！"
echo ""
echo "📋 下一步："
echo "1. 运行 ./start.sh 启动完整系统"
echo "2. 或者分别启动各个服务："
echo "   - 数据库: cd backend && docker-compose up -d"
echo "   - 后端: cd backend && mvn spring-boot:run"
echo "   - 前端: cd frontend && npm run dev:h5"
echo ""