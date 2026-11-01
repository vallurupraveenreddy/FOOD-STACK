package com.foodapp.dto;

import com.foodapp.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean enabled;
    private LocalDateTime createdAt;

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getRole().name(), user.getEnabled(), user.getCreatedAt()
        );
    }
}
