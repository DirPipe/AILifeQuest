package com.errorcapa8.ailifequest.application.dto.response;

import java.util.UUID;

public record UserResponseDTO(UUID userId, String name, String email, int totalXp, String status) {
}
