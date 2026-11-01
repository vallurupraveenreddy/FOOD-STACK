package com.foodapp.repository;

import com.foodapp.model.Orders;
import com.foodapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUserOrderByCreatedAtDesc(User user);
}
