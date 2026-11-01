package com.foodapp.controller;

import com.foodapp.dto.FoodRatingSummary;
import com.foodapp.dto.ReviewRequest;
import com.foodapp.dto.ReviewResponse;
import com.foodapp.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/food/{foodItemId}")
    public ResponseEntity<List<ReviewResponse>> forFood(@PathVariable Long foodItemId) {
        return ResponseEntity.ok(reviewService.getReviewsForFood(foodItemId));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<Long, FoodRatingSummary>> summary() {
        return ResponseEntity.ok(reviewService.getRatingSummary());
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> add(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.addReview(request));
    }
}
