package com.errorcapa8.ailifequest.presentation.globalhandler;

import com.errorcapa8.ailifequest.application.exception.ConflictException;
import com.errorcapa8.ailifequest.application.exception.NotFoundException;
import com.errorcapa8.ailifequest.application.exception.UnauthorizedException;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({DomainException.class, IllegalArgumentException.class, MethodArgumentNotValidException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequest(Exception exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, extractMessage(exception));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException exception) {
        return buildResponse(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        String constraintName = extractConstraintName(exception);
        String message = switch (constraintName == null ? "" : constraintName) {
            case "uk_goals_user_active_title" -> "Ya existe una meta activa con ese título para este usuario.";
            case "uk_challenges_goal_pending_title" -> "Ya existe un reto pendiente con ese título para esta meta.";
            case "uk_users_email" -> "El email ya se encuentra registrado.";
            default -> "La solicitud no cumple una restricción de integridad.";
        };
        HttpStatus status = isKnownUniqueConstraint(constraintName) ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
        return buildResponse(status, message);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Map<String, Object>> handleUnreadableRequest(Exception exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, "El cuerpo o los parámetros de la solicitud tienen un formato inválido.");
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException exception) {
        return buildResponse(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException exception) {
        return buildResponse(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message
        ));
    }

    private String extractMessage(Exception exception) {
        if (exception instanceof MethodArgumentNotValidException validationException) {
            return validationException.getBindingResult().getFieldErrors().stream()
                    .findFirst()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .orElse("Solicitud invalida.");
        }
        String message = exception.getMessage();
        return message == null || message.isBlank() ? "Solicitud invalida." : message;
    }

    private String extractConstraintName(Throwable exception) {
        Throwable cause = exception;
        while (cause != null) {
            if (cause instanceof org.hibernate.exception.ConstraintViolationException constraintViolation) {
                return constraintViolation.getConstraintName();
            }
            cause = cause.getCause();
        }
        return null;
    }

    private boolean isKnownUniqueConstraint(String constraintName) {
        return "uk_goals_user_active_title".equals(constraintName)
                || "uk_challenges_goal_pending_title".equals(constraintName)
                || "uk_users_email".equals(constraintName);
    }
}
