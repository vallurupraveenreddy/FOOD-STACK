package com.foodapp.controller;

import com.foodapp.dto.CouponApplyRequest;
import com.foodapp.dto.CouponApplyResponse;
import com.foodapp.model.Coupon;
import com.foodapp.security.CurrentUserProvider;
import com.foodapp.service.CartService;
import com.foodapp.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final CartService cartService;
    private final CurrentUserProvider currentUserProvider;

    /** Public: shown on the "Today's Offers" banner. */
    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> active() {
        return ResponseEntity.ok(couponService.listActive());
    }

    /** Logged in: preview the discount a coupon would give on the current cart. */
    @PostMapping("/apply")
    public ResponseEntity<CouponApplyResponse> apply(@Valid @RequestBody CouponApplyRequest request) {
        var user = currentUserProvider.getCurrentUser();
        double subtotal = cartService.getCartSubtotal(user);
        double discount = couponService.previewDiscount(request.getCode(), user);

        CouponApplyResponse response = new CouponApplyResponse(
                request.getCode().toUpperCase(),
                subtotal,
                discount,
                subtotal - discount,
                "Coupon applied!"
        );
        return ResponseEntity.ok(response);
    }
}
