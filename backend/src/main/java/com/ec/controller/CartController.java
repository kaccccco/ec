package com.ec.controller;

import com.ec.dto.*;
import com.ec.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
@Tag(name = "Shopping Cart", description = "Shopping cart management APIs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{sessionId}")
    @Operation(summary = "Get cart", description = "Get shopping cart by session ID")
    public ResponseEntity<CartDTO> getCart(@PathVariable String sessionId) {
        try {
            CartDTO cart = cartService.getCart(sessionId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/add")
    @Operation(summary = "Add to cart", description = "Add product to shopping cart")
    public ResponseEntity<CartDTO> addToCart(@Valid @RequestBody AddToCartRequest request) {
        try {
            CartDTO cart = cartService.addToCart(request);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{sessionId}/items/{productId}")
    @Operation(summary = "Update cart item", description = "Update quantity of item in cart")
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable String sessionId,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        try {
            CartDTO cart = cartService.updateCartItem(sessionId, productId, request);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{sessionId}/items/{productId}")
    @Operation(summary = "Remove from cart", description = "Remove product from shopping cart")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable String sessionId,
            @PathVariable Long productId) {
        try {
            cartService.removeFromCart(sessionId, productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{sessionId}")
    @Operation(summary = "Clear cart", description = "Clear all items from shopping cart")
    public ResponseEntity<Void> clearCart(@PathVariable String sessionId) {
        try {
            cartService.clearCart(sessionId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}