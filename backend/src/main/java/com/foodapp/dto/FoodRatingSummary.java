package com.foodapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodRatingSummary {
    private Long foodItemId;
    private Double average;
    private Long count;
}
