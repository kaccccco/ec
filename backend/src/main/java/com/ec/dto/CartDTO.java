package com.ec.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    private Long id;
    private String sessionId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
    private int totalItems;
}