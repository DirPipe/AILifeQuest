package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateChallengeRequestDTO(
        @NotNull UUID goalId,
        String title,
        String description,
        @Min(0) Integer xpReward
) {
}
