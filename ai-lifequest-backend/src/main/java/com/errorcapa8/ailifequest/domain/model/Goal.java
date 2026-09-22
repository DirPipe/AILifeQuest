package com.errorcapa8.ailifequest.domain.model;

import com.errorcapa8.ailifequest.domain.enums.GoalStatus;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.Progress;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Goal {
    private final GoalId id;
    private final UserId userId;
    private String title;
    private String description;
    private String category;
    private LocalDate targetDate;
    private Progress progress;
    private GoalStatus status;
    private List<Challenge> challenges;

    public Goal(GoalId id, UserId userId, String title, String description, String category, LocalDate targetDate) {
        this(id, userId, title, description, category, targetDate, new Progress(0.0), GoalStatus.IN_PROGRESS, new ArrayList<>());
    }

    public Goal(GoalId id, UserId userId, String title, String description, String category, LocalDate targetDate,
                Progress progress, GoalStatus status, List<Challenge> challenges) {
        if (id == null) {
            throw new IllegalArgumentException("El id de la meta no puede ser nulo");
        }
        if (userId == null) {
            throw new IllegalArgumentException("El userId de la meta no puede ser nulo");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("El titulo de la meta no puede estar vacio");
        }
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("La categoria de la meta no puede estar vacia");
        }
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.targetDate = targetDate;
        this.progress = progress == null ? new Progress(0.0) : progress;
        this.status = status == null ? GoalStatus.IN_PROGRESS : status;
        this.challenges = challenges == null ? new ArrayList<>() : new ArrayList<>(challenges);
    }

    public void addChallenge(Challenge challenge) {
        if (this.status != GoalStatus.IN_PROGRESS) {
            throw new DomainException("No se pueden agregar retos a una meta finalizada.");
        }
        if (challenge == null) {
            throw new IllegalArgumentException("El reto no puede ser nulo");
        }
        this.challenges.add(challenge);
        recalculateProgress();
    }

    public void replaceChallenges(List<Challenge> challenges) {
        this.challenges = challenges == null ? new ArrayList<>() : new ArrayList<>(challenges);
        recalculateProgress();
    }

    public void recalculateProgress() {
        long completed = challenges.stream()
                .filter(Challenge::isCompleted)
                .count();
        this.progress = Progress.calculate(completed, challenges.size());
        if (this.progress.percentage() == 100.0 && !challenges.isEmpty()) {
            this.status = GoalStatus.COMPLETED;
        } else if (this.status == GoalStatus.COMPLETED) {
            this.status = GoalStatus.IN_PROGRESS;
        }
    }

    public GoalId getId() {
        return id;
    }

    public UserId getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public Progress getProgress() {
        return progress;
    }

    public GoalStatus getStatus() {
        return status;
    }

    public List<Challenge> getChallenges() {
        return List.copyOf(challenges);
    }
}
