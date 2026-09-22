package com.errorcapa8.ailifequest.domain.valueobject;

import java.util.UUID;

public record GoalId(UUID value) {

    public GoalId {
        if (value == null) {
            throw new IllegalArgumentException("El GoalId no puede ser nulo");
        }
    }
}
