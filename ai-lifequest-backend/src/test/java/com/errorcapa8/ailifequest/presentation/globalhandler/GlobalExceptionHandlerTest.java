package com.errorcapa8.ailifequest.presentation.globalhandler;

import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.SQLException;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {
    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void mapsKnownUniqueConstraintsToConflictWithoutExposingSql() {
        assertConflict("uk_goals_user_active_title", "meta activa");
        assertConflict("uk_challenges_goal_pending_title", "reto pendiente");
        assertConflict("uk_users_email", "email");
    }

    @Test
    void mapsUnknownIntegrityFailuresToSafeBadRequest() {
        ResponseEntity<Map<String, Object>> response = handler.handleDataIntegrityViolation(
                integrityFailure("uk_unknown_constraint"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).containsEntry("message", "La solicitud no cumple una restricción de integridad.");
        assertThat(response.getBody().toString()).doesNotContain("private sql", "select *");
    }

    private void assertConflict(String constraintName, String expectedMessage) {
        ResponseEntity<Map<String, Object>> response = handler.handleDataIntegrityViolation(integrityFailure(constraintName));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).containsEntry("status", 409);
        assertThat(response.getBody().get("message").toString()).contains(expectedMessage);
        assertThat(response.getBody().toString()).doesNotContain("private sql", "select *");
    }

    private DataIntegrityViolationException integrityFailure(String constraintName) {
        return new DataIntegrityViolationException("private sql details",
                new ConstraintViolationException("unique constraint failure", new SQLException("private sql"), constraintName));
    }
}
