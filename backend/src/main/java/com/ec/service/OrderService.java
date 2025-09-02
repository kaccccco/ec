package com.ec.service;

import com.ec.dto.*;
import com.ec.entity.*;
import com.ec.repository.OrderRepository;
import com.ec.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
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

    @CacheEvict(value = {"products", "orders"}, allEntries = true)
    public Order createOrderFromCart(CreateOrderFromCartRequest request, CartDTO cart) {
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 创建订单
        Order order = Order.builder()
                .sessionId(request.getSessionId())
                .totalAmount(cart.getTotalAmount())
                .status(OrderStatus.PENDING)
                .build();

        // 添加订单项并检查库存
        for (CartItemDTO cartItem : cart.getItems()) {
            Product product = productService.getProductById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));

            if (!product.hasEnoughStock(cartItem.getQuantity())) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .productName(product.getName())
                    .productPrice(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();

            order.addItem(orderItem);
        }

        // 扣减库存
        for (OrderItem item : order.getItems()) {
            if (!productService.updateStock(item.getProductId(), item.getQuantity())) {
                throw new RuntimeException("Failed to update stock for product: " + item.getProductName());
            }
        }

        // 保存订单
        Order savedOrder = orderRepository.save(order);
        
        // 缓存订单
        redisService.setOrder(savedOrder.getId(), savedOrder);
        
        log.info("Created order from cart: orderId={}, sessionId={}", savedOrder.getId(), request.getSessionId());
        return savedOrder;
    }

    @Cacheable(value = "orders", key = "#id")
    public Optional<Order> getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        order.ifPresent(o -> redisService.setOrder(o.getId(), o));
        return order;
    }

    public List<Order> getOrdersBySessionId(String sessionId) {
        // This would need a repository method, for now return empty list
        return List.of();
    }
} 