package com.ec.service;

import com.ec.dto.CreateOrderRequest;
import com.ec.entity.Order;
import com.ec.entity.Product;
import com.ec.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final RedisService redisService;
    private final StockLockService stockLockService;

    @CacheEvict(value = {"products", "orders"}, allEntries = true)
    public Order createOrder(CreateOrderRequest request) {
        Product product = productService.getProductById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        String lockId = null;
        
        try {
            lockId = Optional.ofNullable(stockLockService.tryLock(product.getId()))
                .orElseThrow(() -> new RuntimeException("Product is currently being processed, please try again"));

            if (!product.hasEnoughStock(request.getQuantity())) {
                throw new RuntimeException("Insufficient stock");
            }

            if (!productService.updateStock(request.getProductId(), request.getQuantity())) {
                throw new RuntimeException("Failed to update stock");
            }

            Order order = Order.builder()
                .productId(product.getId())
                .productName(product.getName())
                .quantity(request.getQuantity())
                .totalPrice(product.calculateTotalPrice(request.getQuantity()))
                .build();
            
            Order savedOrder = orderRepository.save(order);
            redisService.setOrder(savedOrder.getId(), savedOrder);
            
            log.info("Created order: {}", savedOrder.getId());
            return savedOrder;
            
        } catch (Exception e) {
            productService.rollbackStock(request.getProductId(), request.getQuantity());
            log.error("Failed to create order: {}", e.getMessage());
            throw e;
        } finally {
            Optional.ofNullable(lockId)
                .ifPresent(id -> stockLockService.releaseLock(product.getId(), id));
        }
    }

    @Cacheable(value = "orders", key = "#id")
    public Optional<Order> getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        order.ifPresent(o -> redisService.setOrder(o.getId(), o));
        return order;
    }
} 