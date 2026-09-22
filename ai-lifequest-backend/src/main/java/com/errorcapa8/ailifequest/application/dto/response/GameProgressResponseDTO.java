package com.errorcapa8.ailifequest.application.dto.response;

public record GameProgressResponseDTO(
        UserResponseDTO user,
        GoalResponseDTO goal,
        ChallengeResponseDTO challenge,
        int xpEarned
) {
}
