package com.errorcapa8.ailifequest.domain.valueobject;

import java.util.UUID;

public record ChallengeId(UUID value) {

    public ChallengeId {
        if (value == null) {
            throw new IllegalArgumentException("El ChallengeId no puede ser nulo");
        }
    }
}
