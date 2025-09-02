#!/bin/bash

BASE_URL="http://localhost:8080"
SESSION_ID="test_session_$(date +%s)"

echo "🧪 测试购物车订单系统 API..."
echo "会话ID: $SESSION_ID"
echo ""

# 测试获取商品列表
echo "1. 📦 测试获取商品列表..."
curl -s "$BASE_URL/products" | jq '.' || echo "❌ 获取商品列表失败"
echo ""

# 测试添加商品到购物车
echo "2. 🛒 测试添加商品到购物车..."
curl -s -X POST "$BASE_URL/cart/add" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"productId\":1,\"quantity\":2}" | jq '.' || echo "❌ 添加到购物车失败"
echo ""

# 测试获取购物车
echo "3. 👀 测试获取购物车..."
curl -s "$BASE_URL/cart/$SESSION_ID" | jq '.' || echo "❌ 获取购物车失败"
echo ""

# 测试更新购物车商品数量
echo "4. ✏️ 测试更新购物车商品数量..."
curl -s -X PUT "$BASE_URL/cart/$SESSION_ID/items/1" \
  -H "Content-Type: application/json" \
  -d "{\"quantity\":3}" | jq '.' || echo "❌ 更新购物车失败"
echo ""

# 测试从购物车创建订单
echo "5. 📋 测试从购物车创建订单..."
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/orders/from-cart" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\"}")

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.id')
echo $ORDER_RESPONSE | jq '.' || echo "❌ 创建订单失败"
echo ""

# 测试获取订单详情
if [ "$ORDER_ID" != "null" ] && [ "$ORDER_ID" != "" ]; then
    echo "6. 📄 测试获取订单详情..."
    curl -s "$BASE_URL/orders/$ORDER_ID" | jq '.' || echo "❌ 获取订单详情失败"
    echo ""
fi

echo "✅ API 测试完成！"