package com.ec.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    private String name;
    private BigDecimal price;
    private Integer stock;

    // 业务方法
    public boolean hasStock() {
        return stock != null && stock > 0;
    }

    public boolean hasEnoughStock(Integer requiredQuantity) {
        return stock != null && stock >= requiredQuantity;
    }

    public BigDecimal calculateTotalPrice(Integer quantity) {
        return price != null && quantity != null ? price.multiply(new BigDecimal(quantity)) : BigDecimal.ZERO;
    }

    public void updateStock(Integer newStock) {
        this.stock = newStock;
    }
} 