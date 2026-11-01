package com.foodapp.controller;

import com.foodapp.dto.AdminDashboardResponse;
import com.foodapp.dto.AdminUserResponse;
import com.foodapp.model.Role;
import com.foodapp.service.AdminService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> users() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<AdminUserResponse> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleEnabled(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AdminUserResponse> updateRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateRole(id, request.getRole()));
    }

    @Data
    static class RoleUpdateRequest {
        private Role role;
    }
}
