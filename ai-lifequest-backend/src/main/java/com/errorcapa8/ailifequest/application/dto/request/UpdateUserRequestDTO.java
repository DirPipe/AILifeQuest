package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Email;

public record UpdateUserRequestDTO(
        String name,
        @Email String email
) {
}
