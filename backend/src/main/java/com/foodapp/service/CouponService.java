package com.foodapp.service;

import com.foodapp.exception.ApiException;
import com.foodapp.model.Coupon;
import com.foodapp.model.DiscountType;
import com.foodapp.model.User;
import com.foodapp.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CartService cartService;

    public List<Coupon> listActive() {
        return couponRepository.findByActiveTrue();
    }

    /** Computes the discount for a coupon against the CURRENT user's cart, without persisting anything. */
    public double previewDiscount(String code, User user) {
        double subtotal = cartService.getCartSubtotal(user);
        Coupon coupon = getValidCoupon(code, subtotal);
        return calculateDiscount(coupon, subtotal);
    }

    /** Same calculation, used again at order-placement time so the discount can't be tampered with client-side. */
    public double applyToAmount(String code, double subtotal) {
        Coupon coupon = getValidCoupon(code, subtotal);
        return calculateDiscount(coupon, subtotal);
    }

    private Coupon getValidCoupon(String code, double subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElseThrow(() -> new ApiException("Invalid or expired coupon code", HttpStatus.BAD_REQUEST));

        if (subtotal < coupon.getMinOrderAmount()) {
            throw new ApiException(
                    "This coupon needs a minimum order of $" + coupon.getMinOrderAmount(), HttpStatus.BAD_REQUEST);
        }
        return coupon;
    }

    private double calculateDiscount(Coupon coupon, double subtotal) {
        double discount;
        if (coupon.getDiscountType() == DiscountType.PERCENT) {
            discount = subtotal * (coupon.getValue() / 100.0);
            if (coupon.getMaxDiscount() != null) {
                discount = Math.min(discount, coupon.getMaxDiscount());
            }
        } else {
            discount = coupon.getValue();
        }
        return Math.min(discount, subtotal);
    }
}
