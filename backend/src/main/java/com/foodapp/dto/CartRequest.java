package com.foodapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartRequest {

    @NotNull
    private Long foodItemId;
}
