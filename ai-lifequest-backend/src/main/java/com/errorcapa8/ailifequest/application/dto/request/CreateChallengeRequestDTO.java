package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateChallengeRequestDTO(
        @NotNull UUID goalId,
        @NotBlank @Size(max = 100) String title,
        @Size(max = 200) String description,
        @NotNull @Min(1) Integer xpReward
) {
}
