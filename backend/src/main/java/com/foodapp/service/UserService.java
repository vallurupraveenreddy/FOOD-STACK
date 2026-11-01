package com.foodapp.service;

import com.foodapp.dto.UpdateProfileRequest;
import com.foodapp.dto.UserProfileResponse;
import com.foodapp.model.User;
import com.foodapp.repository.UserRepository;
import com.foodapp.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    public UserProfileResponse getProfile() {
        User user = currentUserProvider.getCurrentUser();
        return UserProfileResponse.from(user);
    }

    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUserProvider.getCurrentUser();

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setZipCode(request.getZipCode());

        User saved = userRepository.save(user);
        return UserProfileResponse.from(saved);
    }
}
