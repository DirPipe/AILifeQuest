package com.errorcapa8.ailifequest.application.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChallengeResponseDTO(
        UUID challengeId,
        UUID goalId,
        String title,
        String description,
        int xpReward,
        String status,
        LocalDateTime completedAt
) {
}
