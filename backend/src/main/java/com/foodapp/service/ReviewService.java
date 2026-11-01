package com.foodapp.service;

import com.foodapp.dto.FoodRatingSummary;
import com.foodapp.dto.ReviewRequest;
import com.foodapp.dto.ReviewResponse;
import com.foodapp.model.FoodItem;
import com.foodapp.model.Review;
import com.foodapp.model.User;
import com.foodapp.repository.FoodItemRepository;
import com.foodapp.repository.ReviewRepository;
import com.foodapp.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final FoodItemRepository foodItemRepository;
    private final CurrentUserProvider currentUserProvider;

    public ReviewResponse addReview(ReviewRequest request) {
        User user = currentUserProvider.getCurrentUser();
        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new com.foodapp.exception.ApiException(
                        "Food item not found: " + request.getFoodItemId(), org.springframework.http.HttpStatus.NOT_FOUND));

        Review review = Review.builder()
                .user(user)
                .foodItem(foodItem)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return ReviewResponse.from(reviewRepository.save(review));
    }

    public List<ReviewResponse> getReviewsForFood(Long foodItemId) {
        return reviewRepository.findByFoodItem_IdOrderByCreatedAtDesc(foodItemId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    /** foodItemId -> { average, count } for every food that has at least one review. */
    public Map<Long, FoodRatingSummary> getRatingSummary() {
        return reviewRepository.aggregateRatings().stream()
                .collect(Collectors.toMap(
                        ReviewRepository.FoodRatingProjection::getFoodItemId,
                        p -> new FoodRatingSummary(p.getFoodItemId(), p.getAverage(), p.getTotal())
                ));
    }
}
