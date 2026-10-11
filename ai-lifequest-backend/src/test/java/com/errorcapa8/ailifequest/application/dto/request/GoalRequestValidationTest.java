package com.errorcapa8.ailifequest.application.dto.request;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class GoalRequestValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void createRequestRequiresTargetDateAndEnforcesTextLimits() {
        CreateGoalRequestDTO missingDate = new CreateGoalRequestDTO(UUID.randomUUID(), "Meta", null, "Estudio", null);
        CreateGoalRequestDTO boundaryValues = new CreateGoalRequestDTO(UUID.randomUUID(), "t".repeat(100), "d".repeat(200), "Estudio", LocalDate.now());
        CreateGoalRequestDTO longTitle = new CreateGoalRequestDTO(UUID.randomUUID(), "t".repeat(101), null, "Estudio", LocalDate.now());
        CreateGoalRequestDTO longDescription = new CreateGoalRequestDTO(UUID.randomUUID(), "Meta", "d".repeat(201), "Estudio", LocalDate.now());
        CreateGoalRequestDTO boundaryCategory = new CreateGoalRequestDTO(UUID.randomUUID(), "Meta", null, "c".repeat(80), LocalDate.now());
        CreateGoalRequestDTO longCategory = new CreateGoalRequestDTO(UUID.randomUUID(), "Meta", null, "c".repeat(81), LocalDate.now());

        assertThat(validator.validate(missingDate)).anyMatch(violation -> violation.getPropertyPath().toString().equals("targetDate"));
        assertThat(validator.validate(boundaryValues)).isEmpty();
        assertThat(validator.validate(longTitle)).anyMatch(violation -> violation.getPropertyPath().toString().equals("title"));
        assertThat(validator.validate(longDescription)).anyMatch(violation -> violation.getPropertyPath().toString().equals("description"));
        assertThat(validator.validate(boundaryCategory)).isEmpty();
        assertThat(validator.validate(longCategory)).anyMatch(violation -> violation.getPropertyPath().toString().equals("category"));
    }

    @Test
    void updateRequestEnforcesTextLimitsWhileAllowingOmittedDate() {
        UpdateGoalRequestDTO validPartialUpdate = new UpdateGoalRequestDTO(UUID.randomUUID(), "Meta", null, null, null);
        UpdateGoalRequestDTO longTitle = new UpdateGoalRequestDTO(UUID.randomUUID(), "t".repeat(101), null, null, null);
        UpdateGoalRequestDTO longDescription = new UpdateGoalRequestDTO(UUID.randomUUID(), null, "d".repeat(201), null, null);
        UpdateGoalRequestDTO longCategory = new UpdateGoalRequestDTO(UUID.randomUUID(), null, null, "c".repeat(81), null);

        assertThat(validator.validate(validPartialUpdate)).isEmpty();
        assertThat(validator.validate(longTitle)).anyMatch(violation -> violation.getPropertyPath().toString().equals("title"));
        assertThat(validator.validate(longDescription)).anyMatch(violation -> violation.getPropertyPath().toString().equals("description"));
        assertThat(validator.validate(longCategory)).anyMatch(violation -> violation.getPropertyPath().toString().equals("category"));
    }
}
