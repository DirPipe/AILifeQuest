package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record CreateGoalRequestDTO(
        @NotNull UUID userId,
        @NotBlank String title,
        String description,
        @NotBlank String category,
        LocalDate targetDate
) {
}
