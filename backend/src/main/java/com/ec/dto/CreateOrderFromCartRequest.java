package com.ec.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderFromCartRequest {
    
    @NotNull(message = "Session ID is required")
    private String sessionId;
}