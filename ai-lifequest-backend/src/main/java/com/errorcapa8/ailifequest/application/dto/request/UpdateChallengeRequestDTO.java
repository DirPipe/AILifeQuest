package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateChallengeRequestDTO(
        @NotNull UUID goalId,
        @Size(max = 100) String title,
        @Size(max = 200) String description,
        @Min(0) Integer xpReward
) {
}
