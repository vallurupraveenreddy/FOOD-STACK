package com.foodapp.controller;

import com.foodapp.dto.CartRequest;
import com.foodapp.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/get")
    public ResponseEntity<Map<Long, Integer>> get() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add")
    public ResponseEntity<Map<Long, Integer>> add(@Valid @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.add(request.getFoodItemId()));
    }

    @PostMapping("/remove")
    public ResponseEntity<Map<Long, Integer>> remove(@Valid @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.remove(request.getFoodItemId()));
    }
}
