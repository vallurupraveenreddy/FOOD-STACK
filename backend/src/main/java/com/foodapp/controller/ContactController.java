package com.foodapp.controller;

import com.foodapp.dto.ContactMessageRequest;
import com.foodapp.model.ContactMessage;
import com.foodapp.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    /** Public — anyone can send a message, logged in or not. Stored in MySQL, nothing is emailed. */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submit(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessage saved = contactMessageRepository.save(ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Thanks — we've received your message and will get back to you soon.",
                "id", saved.getId()
        ));
    }
}
