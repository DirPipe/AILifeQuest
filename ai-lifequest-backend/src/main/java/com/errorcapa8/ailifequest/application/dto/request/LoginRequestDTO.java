package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(
        @NotBlank @Email String email,
        @NotBlank @Size(max = 128) String password
) {
}
