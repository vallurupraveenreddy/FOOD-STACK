package com.foodapp.controller;

import com.foodapp.dto.FoodRequest;
import com.foodapp.model.FoodItem;
import com.foodapp.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    /** Public: anyone can browse the menu, logged in or not. */
    @GetMapping("/list")
    public ResponseEntity<List<FoodItem>> list() {
        return ResponseEntity.ok(foodService.listAll());
    }

    /** Admin only. */
    @PostMapping("/add")
    public ResponseEntity<FoodItem> add(@Valid @RequestBody FoodRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(foodService.create(request));
    }

    /** Admin only. */
    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> update(@PathVariable Long id, @Valid @RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.update(id, request));
    }

    /** Admin only. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> remove(@PathVariable Long id) {
        foodService.delete(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Food item removed"));
    }
}
