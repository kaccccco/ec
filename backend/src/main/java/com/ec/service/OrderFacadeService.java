package com.ec.service;

import com.ec.dto.*;
import com.ec.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OrderFacadeService {

    private final OrderService orderService;
    private final CartService cartService;

    public Order createOrderFromCart(CreateOrderFromCartRequest request) {
        // 获取购物车
        CartDTO cart = cartService.getCart(request.getSessionId());
        
        // 创建订单
        Order order = orderService.createOrderFromCart(request, cart);
        
        // 清空购物车
        cartService.clearCart(request.getSessionId());
        
        return order;
    }
}