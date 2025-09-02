package com.ec.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "cart")
public class CartItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;
    
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "product_name")
    private String productName;
    
    @Column(name = "product_price")
    private BigDecimal productPrice;
    
    private Integer quantity;
    
    // 业务方法
    public BigDecimal getTotalPrice() {
        return productPrice != null && quantity != null ? 
               productPrice.multiply(new BigDecimal(quantity)) : 
               BigDecimal.ZERO;
    }
    
    public void updateQuantity(Integer newQuantity) {
        this.quantity = newQuantity;
    }
    
    public boolean isForProduct(Long productId) {
        return this.productId != null && this.productId.equals(productId);
    }
}