package com.foodapp.service;

import com.foodapp.model.CartItem;
import com.foodapp.model.FoodItem;
import com.foodapp.model.User;
import com.foodapp.repository.CartItemRepository;
import com.foodapp.repository.FoodItemRepository;
import com.foodapp.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;
    private final CurrentUserProvider currentUserProvider;

    /** Returns the cart as { foodItemId: quantity }, matching the shape the React StoreContext already uses. */
    public Map<Long, Integer> getCart() {
        User user = currentUserProvider.getCurrentUser();
        return cartItemRepository.findByUser(user).stream()
                .collect(Collectors.toMap(ci -> ci.getFoodItem().getId(), CartItem::getQuantity));
    }

    public Map<Long, Integer> add(Long foodItemId) {
        User user = currentUserProvider.getCurrentUser();
        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new com.foodapp.exception.ApiException(
                        "Food item not found: " + foodItemId, org.springframework.http.HttpStatus.NOT_FOUND));

        CartItem cartItem = cartItemRepository.findByUserAndFoodItem_Id(user, foodItemId)
                .orElseGet(() -> CartItem.builder().user(user).foodItem(foodItem).quantity(0).build());

        cartItem.setQuantity(cartItem.getQuantity() + 1);
        cartItemRepository.save(cartItem);
        return getCart();
    }

    public Map<Long, Integer> remove(Long foodItemId) {
        User user = currentUserProvider.getCurrentUser();
        cartItemRepository.findByUserAndFoodItem_Id(user, foodItemId).ifPresent(cartItem -> {
            int newQty = cartItem.getQuantity() - 1;
            if (newQty <= 0) {
                cartItemRepository.delete(cartItem);
            } else {
                cartItem.setQuantity(newQty);
                cartItemRepository.save(cartItem);
            }
        });
        return getCart();
    }

    public void clear(User user) {
        cartItemRepository.deleteByUser(user);
    }

    public List<CartItem> getCartEntities(User user) {
        return cartItemRepository.findByUser(user);
    }

    /** Server-side cart subtotal — never trust a total sent from the frontend. */
    public double getCartSubtotal(User user) {
        return getCartEntities(user).stream()
                .mapToDouble(ci -> ci.getFoodItem().getPrice() * ci.getQuantity())
                .sum();
    }
}
