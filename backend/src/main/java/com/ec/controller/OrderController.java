package com.ec.controller;

import com.ec.dto.*;
import com.ec.entity.Order;
import com.ec.service.OrderService;
import com.ec.service.OrderFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Order management APIs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderFacadeService orderFacadeService;

    @PostMapping
    @Operation(summary = "Create a new order", description = "Creates a new order with product ID and quantity")
    @CacheEvict(value = {"products", "orders"}, allEntries = true)
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            return ResponseEntity.ok(orderService.createOrder(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/from-cart")
    @Operation(summary = "Create order from cart", description = "Creates a new order from shopping cart items")
    @CacheEvict(value = {"products", "orders"}, allEntries = true)
    public ResponseEntity<Order> createOrderFromCart(@Valid @RequestBody CreateOrderFromCartRequest request) {
        try {
            return ResponseEntity.ok(orderFacadeService.createOrderFromCart(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Returns order details by order ID")
    @Cacheable(value = "orders", key = "#id")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Get orders by session", description = "Returns all orders for a session")
    public ResponseEntity<List<Order>> getOrdersBySessionId(@PathVariable String sessionId) {
        try {
            List<Order> orders = orderService.getOrdersBySessionId(sessionId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 