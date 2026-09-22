package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateChallengeRequestDTO(
        @NotNull UUID goalId,
        @NotBlank String title,
        String description,
        @Min(0) int xpReward
) {
}
