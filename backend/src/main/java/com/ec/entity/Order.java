package com.ec.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "product_name")
    private String productName;
    
    private Integer quantity;
    
    @Column(name = "total_price")
    private BigDecimal totalPrice;

    // 自定义构造函数
    public Order(Long productId, String productName, Integer quantity, BigDecimal totalPrice) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    // 业务方法
    public boolean isValid() {
        return productId != null && quantity != null && 
               quantity > 0 && totalPrice != null && totalPrice.compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isForProduct(Long productId) {
        return this.productId != null && this.productId.equals(productId);
    }

    public BigDecimal getUnitPrice() {
        return quantity != null && quantity > 0 && totalPrice != null ? 
               totalPrice.divide(new BigDecimal(quantity), 2, BigDecimal.ROUND_HALF_UP) : 
               BigDecimal.ZERO;
    }
} 