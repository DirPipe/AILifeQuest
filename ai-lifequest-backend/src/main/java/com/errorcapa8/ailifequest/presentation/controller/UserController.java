package com.errorcapa8.ailifequest.presentation.controller;

import com.errorcapa8.ailifequest.application.dto.response.UserResponseDTO;
import com.errorcapa8.ailifequest.application.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
