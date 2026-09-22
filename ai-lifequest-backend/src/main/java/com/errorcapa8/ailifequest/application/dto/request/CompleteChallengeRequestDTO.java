package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CompleteChallengeRequestDTO(@NotNull UUID challengeId) {
}
