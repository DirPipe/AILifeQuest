package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequestDTO(
        @Size(max = 120) String name,
        @Email @Size(max = 180) String email
) {
}
