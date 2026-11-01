package com.foodapp.service;

import com.foodapp.dto.FoodRequest;
import com.foodapp.exception.ApiException;
import com.foodapp.model.FoodItem;
import com.foodapp.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodItemRepository foodItemRepository;

    public List<FoodItem> listAll() {
        return foodItemRepository.findAll();
    }

    public FoodItem getById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ApiException("Food item not found: " + id, HttpStatus.NOT_FOUND));
    }

    public FoodItem create(FoodRequest request) {
        FoodItem item = FoodItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .image(request.getImage())
                .build();
        return foodItemRepository.save(item);
    }

    public FoodItem update(Long id, FoodRequest request) {
        FoodItem item = getById(id);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setImage(request.getImage());
        return foodItemRepository.save(item);
    }

    public void delete(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new ApiException("Food item not found: " + id, HttpStatus.NOT_FOUND);
        }
        foodItemRepository.deleteById(id);
    }
}
