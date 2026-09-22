package com.errorcapa8.ailifequest.application.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record GoalResponseDTO(
        UUID goalId,
        UUID userId,
        String title,
        String description,
        String category,
        LocalDate targetDate,
        double progress,
        String status
) {
}
