package com.ec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.Optional;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Lua 脚本：原子性检查和减少库存
    private static final String STOCK_DEDUCTION_SCRIPT = 
        "local stock_key = KEYS[1] " +
        "local quantity = tonumber(ARGV[1]) " +
        "local current_stock = tonumber(redis.call('GET', stock_key)) " +
        "if current_stock == nil then " +
        "    return -1 " +  // 产品不存在
        "end " +
        "if current_stock < quantity then " +
        "    return -2 " +  // 库存不足
        "end " +
        "redis.call('DECRBY', stock_key, quantity) " +
        "return current_stock - quantity";

    // Lua 脚本：原子性增加库存（用于回滚）
    private static final String STOCK_ROLLBACK_SCRIPT = 
        "local stock_key = KEYS[1] " +
        "local quantity = tonumber(ARGV[1]) " +
        "redis.call('INCRBY', stock_key, quantity) " +
        "return redis.call('GET', stock_key)";

    /**
     * 原子性减少库存
     * @param productId 产品ID
     * @param quantity 减少数量
     * @return 操作结果：-1产品不存在，-2库存不足，>=0剩余库存
     */
    public Long deductStock(Long productId, Integer quantity) {
        return redisTemplate.execute(
            createScript(STOCK_DEDUCTION_SCRIPT, Long.class),
            Collections.singletonList("product:stock:" + productId),
            quantity.toString()
        );
    }

    /**
     * 回滚库存（增加库存）
     * @param productId 产品ID
     * @param quantity 增加数量
     * @return 当前库存
     */
    public Long rollbackStock(Long productId, Integer quantity) {
        return redisTemplate.execute(
            createScript(STOCK_ROLLBACK_SCRIPT, Long.class),
            Collections.singletonList("product:stock:" + productId),
            quantity.toString()
        );
    }

    /**
     * 设置产品库存
     * @param productId 产品ID
     * @param stock 库存数量
     */
    public void setProductStock(Long productId, Integer stock) {
        redisTemplate.opsForValue().set("product:stock:" + productId, stock);
    }

    /**
     * 获取产品库存
     * @param productId 产品ID
     * @return 库存数量
     */
    public Integer getProductStock(Long productId) {
        return Optional.ofNullable(redisTemplate.opsForValue().get("product:stock:" + productId))
            .map(value -> Integer.valueOf(value.toString()))
            .orElse(null);
    }

    /**
     * 设置产品信息
     * @param productId 产品ID
     * @param product 产品对象
     */
    public void setProduct(Long productId, Object product) {
        redisTemplate.opsForValue().set("product:" + productId, product);
    }

    /**
     * 获取产品信息
     * @param productId 产品ID
     * @param clazz 产品类型
     * @return 产品对象
     */
    @SuppressWarnings("unchecked")
    public <T> T getProduct(Long productId, Class<T> clazz) {
        return Optional.ofNullable(redisTemplate.opsForValue().get("product:" + productId))
            .map(value -> (T) value)
            .orElse(null);
    }

    /**
     * 设置订单信息
     * @param orderId 订单ID
     * @param order 订单对象
     */
    public void setOrder(Long orderId, Object order) {
        redisTemplate.opsForValue().set("order:" + orderId, order, 24, TimeUnit.HOURS); // 24小时过期
    }

    /**
     * 获取订单信息
     * @param orderId 订单ID
     * @param clazz 订单类型
     * @return 订单对象
     */
    @SuppressWarnings("unchecked")
    public <T> T getOrder(Long orderId, Class<T> clazz) {
        return Optional.ofNullable(redisTemplate.opsForValue().get("order:" + orderId))
            .map(value -> (T) value)
            .orElse(null);
    }

    /**
     * 设置所有产品列表
     * @param products 产品列表
     */
    public void setAllProducts(List<?> products) {
        redisTemplate.opsForValue().set("products:all", products, 1, TimeUnit.HOURS); // 1小时过期
    }

    /**
     * 获取所有产品列表
     * @param clazz 产品类型
     * @return 产品列表
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> getAllProducts(Class<T> clazz) {
        return Optional.ofNullable(redisTemplate.opsForValue().get("products:all"))
            .map(value -> (List<T>) value)
            .orElse(null);
    }

    /**
     * 删除缓存
     * @param key 缓存键
     */
    public void delete(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 批量删除缓存
     * @param keys 缓存键列表
     */
    public void delete(List<String> keys) {
        redisTemplate.delete(keys);
    }

    private <T> DefaultRedisScript<T> createScript(String scriptText, Class<T> resultType) {
        DefaultRedisScript<T> script = new DefaultRedisScript<>();
        script.setScriptText(scriptText);
        script.setResultType(resultType);
        return script;
    }
} 