package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AccountRequestValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void registrationAcceptsDatabaseBoundariesAndRejectsLongValues() {
        String maximumEmail = "a".repeat(64) + "@" + "b".repeat(63) + "." + "c".repeat(47) + ".com";
        String tooLongEmail = "a".repeat(64) + "@" + "b".repeat(63) + "." + "c".repeat(48) + ".com";
        RegisterRequestDTO boundaryRequest = new RegisterRequestDTO("n".repeat(120), maximumEmail, "p".repeat(128));

        assertThat(maximumEmail).hasSize(180);
        assertThat(validator.validate(boundaryRequest)).isEmpty();
        assertThat(validator.validate(new RegisterRequestDTO("n".repeat(121), "ana@example.com", "password")))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("name"));
        assertThat(validator.validate(new RegisterRequestDTO("Ana", tooLongEmail, "password")))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("email"));
        assertThat(validator.validate(new RegisterRequestDTO("Ana", "ana@example.com", "12345")))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("password"));
        assertThat(validator.validate(new RegisterRequestDTO("Ana", "ana@example.com", "p".repeat(129))))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("password"));
    }

    @Test
    void userUpdateLimitsFieldsButAllowsOmittedFields() {
        UpdateUserRequestDTO omittedFields = new UpdateUserRequestDTO(null, null);
        UpdateUserRequestDTO boundaryValues = new UpdateUserRequestDTO("n".repeat(120),
                "a".repeat(64) + "@" + "b".repeat(63) + "." + "c".repeat(47) + ".com");

        assertThat(validator.validate(omittedFields)).isEmpty();
        assertThat(validator.validate(boundaryValues)).isEmpty();
        assertThat(validator.validate(new UpdateUserRequestDTO("n".repeat(121), null)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("name"));
        assertThat(validator.validate(new UpdateUserRequestDTO(null, "a".repeat(64) + "@" + "b".repeat(63) + "." + "c".repeat(48) + ".com")))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("email"));
    }

    @Test
    void loginRejectsPasswordsLongerThanTheSupportedLimit() {
        assertThat(validator.validate(new LoginRequestDTO("ana@example.com", "p".repeat(128)))).isEmpty();
        assertThat(validator.validate(new LoginRequestDTO("ana@example.com", "p".repeat(129))))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("password"));
    }

    @Test
    void challengeCreationRequiresAnExplicitNonnegativeXpReward() {
        assertThat(validator.validate(new CreateChallengeRequestDTO(java.util.UUID.randomUUID(), "Reto", null, 0))).isEmpty();
        assertThat(validator.validate(new CreateChallengeRequestDTO(java.util.UUID.randomUUID(), "Reto", null, null)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("xpReward"));
        assertThat(validator.validate(new CreateChallengeRequestDTO(java.util.UUID.randomUUID(), "Reto", null, -1)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("xpReward"));
    }
}
