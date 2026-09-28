package com.errorcapa8.ailifequest.infrastructure.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "goal_progress")
public class GoalProgressEntity {
    @Id
    private UUID id;
    @Column(name = "goal_id", nullable = false, unique = true)
    private UUID goalId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false, insertable = false, updatable = false)
    private GoalEntity goal;
    @Column(name = "total_challenges", nullable = false)
    private int totalChallenges;
    @Column(name = "completed_challenges", nullable = false)
    private int completedChallenges;
    @Column(name = "progress_percentage", nullable = false)
    private double progressPercentage;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void onSave() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getGoalId() { return goalId; }
    public void setGoalId(UUID goalId) { this.goalId = goalId; }
    public GoalEntity getGoal() { return goal; }
    public int getTotalChallenges() { return totalChallenges; }
    public void setTotalChallenges(int totalChallenges) { this.totalChallenges = totalChallenges; }
    public int getCompletedChallenges() { return completedChallenges; }
    public void setCompletedChallenges(int completedChallenges) { this.completedChallenges = completedChallenges; }
    public double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }
}
