package com.foodapp.service;

import com.foodapp.dto.OrderRequest;
import com.foodapp.exception.ApiException;
import com.foodapp.model.*;
import com.foodapp.repository.OrdersRepository;
import com.foodapp.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrdersRepository ordersRepository;
    private final CartService cartService;
    private final CurrentUserProvider currentUserProvider;
    private final CouponService couponService;

    @Transactional
    public Orders placeOrder(OrderRequest request) {
        User user = currentUserProvider.getCurrentUser();
        List<CartItem> cartItems = cartService.getCartEntities(user);

        if (cartItems.isEmpty()) {
            throw new ApiException("Your cart is empty", HttpStatus.BAD_REQUEST);
        }

        double subtotal = cartItems.stream()
                .mapToDouble(ci -> ci.getFoodItem().getPrice() * ci.getQuantity())
                .sum();

        double discount = 0.0;
        String appliedCode = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            discount = couponService.applyToAmount(request.getCouponCode(), subtotal);
            appliedCode = request.getCouponCode().toUpperCase();
        }

        double deliveryFee = 2.0; // flat delivery fee, matches the frontend's Cart.jsx total
        double amount = subtotal + deliveryFee - discount;

        Orders order = Orders.builder()
                .user(user)
                .amount(amount)
                .discountAmount(discount)
                .couponCode(appliedCode)
                .paymentMethod(request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()
                        ? "COD" : request.getPaymentMethod())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .country(request.getCountry())
                .phone(request.getPhone())
                .status(OrderStatus.PLACED)
                .build();

        List<OrderItem> items = cartItems.stream().map(ci -> OrderItem.builder()
                .order(order)
                .foodItem(ci.getFoodItem())
                .quantity(ci.getQuantity())
                .priceAtOrder(ci.getFoodItem().getPrice())
                .build()).toList();

        order.setItems(items);

        Orders saved = ordersRepository.save(order);
        cartService.clear(user);
        return saved;
    }

    public List<Orders> myOrders() {
        User user = currentUserProvider.getCurrentUser();
        return ordersRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Orders> allOrders() {
        return ordersRepository.findAll();
    }

    public Orders updateStatus(Long orderId, OrderStatus status) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found: " + orderId, HttpStatus.NOT_FOUND));
        order.setStatus(status);
        return ordersRepository.save(order);
    }
}
