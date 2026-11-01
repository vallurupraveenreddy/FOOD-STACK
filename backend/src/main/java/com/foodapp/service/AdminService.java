package com.foodapp.service;

import com.foodapp.dto.AdminDashboardResponse;
import com.foodapp.dto.AdminUserResponse;
import com.foodapp.exception.ApiException;
import com.foodapp.model.OrderStatus;
import com.foodapp.model.Orders;
import com.foodapp.model.Role;
import com.foodapp.model.User;
import com.foodapp.repository.OrdersRepository;
import com.foodapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrdersRepository ordersRepository;

    private static final Set<OrderStatus> PENDING_STATUSES = Set.of(
            OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY
    );

    public AdminDashboardResponse getDashboard() {
        List<Orders> allOrders = ordersRepository.findAll();

        double revenue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(Orders::getAmount)
                .sum();

        long pending = allOrders.stream()
                .filter(o -> PENDING_STATUSES.contains(o.getStatus()))
                .count();

        return new AdminDashboardResponse(
                userRepository.count(),
                allOrders.size(),
                revenue,
                pending
        );
    }

    public List<AdminUserResponse> listUsers() {
        return userRepository.findAll().stream().map(AdminUserResponse::from).toList();
    }

    public AdminUserResponse toggleEnabled(Long userId) {
        User user = getUser(userId);
        user.setEnabled(user.getEnabled() == null || !user.getEnabled());
        return AdminUserResponse.from(userRepository.save(user));
    }

    public AdminUserResponse updateRole(Long userId, Role role) {
        User user = getUser(userId);
        user.setRole(role);
        return AdminUserResponse.from(userRepository.save(user));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found: " + id, HttpStatus.NOT_FOUND));
    }
}
