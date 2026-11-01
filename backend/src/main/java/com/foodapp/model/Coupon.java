package com.foodapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    /** Percentage (0-100) if PERCENT, or a flat currency amount if FLAT. */
    @Column(nullable = false)
    private Double value;

    /** Caps how much a PERCENT coupon can discount. Ignored for FLAT. Null = no cap. */
    private Double maxDiscount;

    /** Order subtotal must be at least this much for the coupon to apply. */
    @Builder.Default
    private Double minOrderAmount = 0.0;

    @Builder.Default
    private Boolean active = true;
}
