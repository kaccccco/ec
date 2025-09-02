package com.ec.service;

import com.ec.dto.*;
import com.ec.entity.*;
import com.ec.repository.CartRepository;
import com.ec.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final RedisService redisService;

    public CartDTO getCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        return convertToDTO(cart);
    }

    public CartDTO addToCart(AddToCartRequest request) {
        // 获取产品信息
        Product product = productService.getProductById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 检查库存
        if (!product.hasEnoughStock(request.getQuantity())) {
            throw new RuntimeException("Insufficient stock");
        }

        // 获取或创建购物车
        Cart cart = getOrCreateCart(request.getSessionId());

        // 检查是否已存在该商品
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.isForProduct(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // 更新数量
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            
            if (!product.hasEnoughStock(newQuantity)) {
                throw new RuntimeException("Insufficient stock for total quantity");
            }
            
            item.updateQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            // 添加新商品
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(product.getId())
                    .productName(product.getName())
                    .productPrice(product.getPrice())
                    .quantity(request.getQuantity())
                    .build();
            
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        
        // 更新Redis缓存
        CartDTO cartDTO = convertToDTO(cart);
        redisService.setCart(request.getSessionId(), cartDTO);
        
        log.info("Added to cart: productId={}, quantity={}, sessionId={}", 
                request.getProductId(), request.getQuantity(), request.getSessionId());
        
        return cartDTO;
    }

    public CartDTO updateCartItem(String sessionId, Long productId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(sessionId);
        
        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.isForProduct(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (request.getQuantity() == 0) {
            // 删除商品
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            // 检查库存
            Product product = productService.getProductById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
                    
            if (!product.hasEnoughStock(request.getQuantity())) {
                throw new RuntimeException("Insufficient stock");
            }
            
            item.updateQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }

        cartRepository.save(cart);
        
        // 更新Redis缓存
        CartDTO cartDTO = convertToDTO(cart);
        redisService.setCart(sessionId, cartDTO);
        
        log.info("Updated cart item: productId={}, quantity={}, sessionId={}", 
                productId, request.getQuantity(), sessionId);
        
        return cartDTO;
    }

    public void removeFromCart(String sessionId, Long productId) {
        Cart cart = getOrCreateCart(sessionId);
        
        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.isForProduct(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.removeItem(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
        
        // 更新Redis缓存
        CartDTO cartDTO = convertToDTO(cart);
        redisService.setCart(sessionId, cartDTO);
        
        log.info("Removed from cart: productId={}, sessionId={}", productId, sessionId);
    }

    public void clearCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        cart.clearItems();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);
        
        // 清除Redis缓存
        redisService.deleteCart(sessionId);
        
        log.info("Cleared cart: sessionId={}", sessionId);
    }

    private Cart getOrCreateCart(String sessionId) {
        return cartRepository.findBySessionIdWithItems(sessionId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .sessionId(sessionId)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private CartDTO convertToDTO(Cart cart) {
        return CartDTO.builder()
                .id(cart.getId())
                .sessionId(cart.getSessionId())
                .items(cart.getItems().stream()
                        .map(this::convertItemToDTO)
                        .collect(Collectors.toList()))
                .totalAmount(cart.getTotalAmount())
                .totalItems(cart.getTotalItems())
                .build();
    }

    private CartItemDTO convertItemToDTO(CartItem item) {
        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productPrice(item.getProductPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}