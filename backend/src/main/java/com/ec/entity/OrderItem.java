package com.ec.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "order")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
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
    
    public boolean isForProduct(Long productId) {
        return this.productId != null && this.productId.equals(productId);
    }
}