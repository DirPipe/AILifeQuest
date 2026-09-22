package com.errorcapa8.ailifequest.domain.valueobject;

import java.util.UUID;

public record UserId(UUID value) {

    public UserId {
        if (value == null) {
            throw new IllegalArgumentException("El UserId no puede ser nulo");
        }
    }
}
