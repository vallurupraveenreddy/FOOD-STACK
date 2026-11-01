package com.foodapp.repository;

import com.foodapp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByFoodItem_IdOrderByCreatedAtDesc(Long foodItemId);

    @Query("select r.foodItem.id as foodItemId, avg(r.rating) as average, count(r) as total " +
           "from Review r group by r.foodItem.id")
    List<FoodRatingProjection> aggregateRatings();

    interface FoodRatingProjection {
        Long getFoodItemId();
        Double getAverage();
        Long getTotal();
    }
}
