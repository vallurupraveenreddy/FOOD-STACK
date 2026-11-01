package com.foodapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    // Email is intentionally NOT editable here — it's the login identifier.
    // Changing it would require re-verification, which is out of scope for now.

    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
}
