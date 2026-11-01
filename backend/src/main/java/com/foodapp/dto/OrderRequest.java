package com.foodapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String email;
    @NotBlank private String street;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String zipCode;
    @NotBlank private String country;
    @NotBlank private String phone;

    /** Optional. Validated and re-calculated server-side, never trusted from the client as-is. */
    private String couponCode;

    /** "COD" or "ONLINE" — no real payment gateway is integrated; ONLINE is simulated. */
    private String paymentMethod;
}
