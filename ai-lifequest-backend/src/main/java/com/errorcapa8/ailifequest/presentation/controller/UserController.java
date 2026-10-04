package com.errorcapa8.ailifequest.presentation.controller;

import com.errorcapa8.ailifequest.application.dto.request.UpdateUserRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.UserResponseDTO;
import com.errorcapa8.ailifequest.application.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponseDTO getUser(@RequestParam UUID userId) {
        return userService.getUser(userId);
    }

    @PatchMapping("/{userId}")
    public UserResponseDTO updateUser(@PathVariable UUID userId, @Valid @RequestBody UpdateUserRequestDTO request) {
        return userService.updateUser(userId, request);
    }

    @PatchMapping("/{userId}/deactivate")
    public UserResponseDTO deactivateUser(@PathVariable UUID userId) {
        return userService.deactivateUser(userId);
    }
}
