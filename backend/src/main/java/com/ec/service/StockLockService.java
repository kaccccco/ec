package com.ec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.Optional;

@Service
public class StockLockService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String LOCK_PREFIX = "stock:lock:";
    private static final long LOCK_TIMEOUT = 30; // 30秒锁超时

    /**
     * 尝试获取库存锁
     * @param productId 产品ID
     * @return 锁ID，如果获取失败返回null
     */
    public String tryLock(Long productId) {
        String lockKey = LOCK_PREFIX + productId;
        String lockValue = UUID.randomUUID().toString();
        
        return Optional.ofNullable(redisTemplate.opsForValue()
            .setIfAbsent(lockKey, lockValue, LOCK_TIMEOUT, TimeUnit.SECONDS))
            .filter(success -> success)
            .map(success -> lockValue)
            .orElse(null);
    }

    /**
     * 释放库存锁
     * @param productId 产品ID
     * @param lockId 锁ID
     * @return 是否成功释放
     */
    public boolean releaseLock(Long productId, String lockId) {
        String lockKey = LOCK_PREFIX + productId;
        
        // 使用 Lua 脚本确保原子性释放锁
        String script = 
            "if redis.call('GET', KEYS[1]) == ARGV[1] then " +
            "    return redis.call('DEL', KEYS[1]) " +
            "else " +
            "    return 0 " +
            "end";
        
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptText(script);
        redisScript.setResultType(Long.class);
        
        return Optional.ofNullable(redisTemplate.execute(redisScript, 
            Collections.singletonList(lockKey), lockId))
            .map(result -> result == 1)
            .orElse(false);
    }

    /**
     * 检查锁是否存在
     * @param productId 产品ID
     * @return 是否存在锁
     */
    public boolean isLocked(Long productId) {
        return Optional.ofNullable(redisTemplate.hasKey(LOCK_PREFIX + productId))
            .orElse(false);
    }
} 