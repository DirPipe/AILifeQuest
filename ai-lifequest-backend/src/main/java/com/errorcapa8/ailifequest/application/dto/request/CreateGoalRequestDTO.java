package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record CreateGoalRequestDTO(
        @NotNull UUID userId,
        @NotBlank @Size(max = 100) String title,
        @Size(max = 200) String description,
        @NotBlank String category,
        @NotNull LocalDate targetDate
) {
}
