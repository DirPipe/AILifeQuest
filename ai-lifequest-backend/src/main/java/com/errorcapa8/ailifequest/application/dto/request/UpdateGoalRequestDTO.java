package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateGoalRequestDTO(
        @NotNull UUID userId,
        @Size(max = 100) String title,
        @Size(max = 200) String description,
        @Size(max = 80) String category,
        LocalDate targetDate
) {
}
