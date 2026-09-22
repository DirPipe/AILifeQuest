package com.errorcapa8.ailifequest.domain.model;

import com.errorcapa8.ailifequest.domain.enums.ChallengeStatus;
import com.errorcapa8.ailifequest.domain.exception.ChallengeAlreadyCompletedException;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;

import java.time.LocalDateTime;

public class Challenge {
    private final ChallengeId id;
    private final GoalId goalId;
    private String title;
    private String description;
    private XP xpReward;
    private ChallengeStatus status;
    private LocalDateTime completedAt;

    public Challenge(ChallengeId id, GoalId goalId, String title, String description, XP xpReward) {
        this(id, goalId, title, description, xpReward, ChallengeStatus.AVAILABLE, null);
    }

    public Challenge(ChallengeId id, GoalId goalId, String title, String description, XP xpReward,
                     ChallengeStatus status, LocalDateTime completedAt) {
        if (id == null) {
            throw new IllegalArgumentException("El id del reto no puede ser nulo");
        }
        if (goalId == null) {
            throw new IllegalArgumentException("El goalId del reto no puede ser nulo");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("El titulo del reto no puede estar vacio");
        }
        this.id = id;
        this.goalId = goalId;
        this.title = title;
        this.description = description;
        this.xpReward = xpReward == null ? new XP(0) : xpReward;
        this.status = status == null ? ChallengeStatus.AVAILABLE : status;
        this.completedAt = completedAt;
    }

    public XP complete() {
        if (this.status == ChallengeStatus.COMPLETED) {
            throw new ChallengeAlreadyCompletedException();
        }
        if (this.status == ChallengeStatus.LOCKED) {
            throw new DomainException("No se puede completar un reto bloqueado.");
        }
        this.status = ChallengeStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        return this.xpReward;
    }

    public boolean isCompleted() {
        return this.status == ChallengeStatus.COMPLETED;
    }

    public ChallengeId getId() {
        return id;
    }

    public GoalId getGoalId() {
        return goalId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public XP getXpReward() {
        return xpReward;
    }

    public ChallengeStatus getStatus() {
        return status;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
