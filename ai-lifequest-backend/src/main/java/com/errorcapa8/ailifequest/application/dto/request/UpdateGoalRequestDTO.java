package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateGoalRequestDTO(
        @NotNull UUID userId,
        String title,
        String description,
        String category,
        LocalDate targetDate
) {
}
