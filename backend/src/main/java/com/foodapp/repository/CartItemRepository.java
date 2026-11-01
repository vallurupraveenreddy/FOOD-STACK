package com.foodapp.repository;

import com.foodapp.model.CartItem;
import com.foodapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndFoodItem_Id(User user, Long foodItemId);
    void deleteByUser(User user);
}
