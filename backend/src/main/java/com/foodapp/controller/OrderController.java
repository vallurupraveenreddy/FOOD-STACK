package com.foodapp.controller;

import com.foodapp.dto.OrderRequest;
import com.foodapp.model.OrderStatus;
import com.foodapp.model.Orders;
import com.foodapp.service.OrderService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** Logged-in user places an order from whatever is currently in their DB-backed cart. */
    @PostMapping("/place")
    public ResponseEntity<Orders> place(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    /** Logged-in user's own order history — powers the new "My Orders" page. */
    @GetMapping("/userorders")
    public ResponseEntity<List<Orders>> myOrders() {
        return ResponseEntity.ok(orderService.myOrders());
    }

    /** Admin only. */
    @GetMapping("/list")
    public ResponseEntity<List<Orders>> allOrders() {
        return ResponseEntity.ok(orderService.allOrders());
    }

    /** Admin only. */
    @PostMapping("/status")
    public ResponseEntity<Orders> updateStatus(@RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(request.getOrderId(), request.getStatus()));
    }

    @Data
    static class StatusUpdateRequest {
        private Long orderId;
        private OrderStatus status;
    }
}
