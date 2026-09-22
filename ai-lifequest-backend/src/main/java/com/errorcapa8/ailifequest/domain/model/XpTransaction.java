package com.errorcapa8.ailifequest.domain.model;

import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;

import java.time.LocalDateTime;
import java.util.UUID;

public class XpTransaction {
    private final UUID id;
    private final UserId userId;
    private final ChallengeId challengeId;
    private final XP amount;
    private final String reason;
    private final LocalDateTime createdAt;

    public XpTransaction(UUID id, UserId userId, ChallengeId challengeId, XP amount, String reason, LocalDateTime createdAt) {
        if (id == null) {
            throw new IllegalArgumentException("El id de la transaccion XP no puede ser nulo");
        }
        if (userId == null) {
            throw new IllegalArgumentException("El userId de la transaccion XP no puede ser nulo");
        }
        if (amount == null || amount.value() <= 0) {
            throw new IllegalArgumentException("La transaccion XP debe tener un monto positivo");
        }
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("La razon de la transaccion XP no puede estar vacia");
        }
        this.id = id;
        this.userId = userId;
        this.challengeId = challengeId;
        this.amount = amount;
        this.reason = reason;
        this.createdAt = createdAt == null ? LocalDateTime.now() : createdAt;
    }

    public static XpTransaction forCompletedChallenge(UserId userId, ChallengeId challengeId, XP amount) {
        return new XpTransaction(UUID.randomUUID(), userId, challengeId, amount, "CHALLENGE_COMPLETED", LocalDateTime.now());
    }

    public UUID getId() {
        return id;
    }

    public UserId getUserId() {
        return userId;
    }

    public ChallengeId getChallengeId() {
        return challengeId;
    }

    public XP getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
