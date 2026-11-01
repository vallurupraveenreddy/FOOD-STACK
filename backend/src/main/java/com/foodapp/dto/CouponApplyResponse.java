package com.foodapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponApplyResponse {
    private String code;
    private Double subtotal;
    private Double discountAmount;
    private Double newTotal;
    private String message;
}
