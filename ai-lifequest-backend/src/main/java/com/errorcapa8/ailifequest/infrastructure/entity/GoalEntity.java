package com.errorcapa8.ailifequest.infrastructure.entity;

import com.errorcapa8.ailifequest.domain.enums.GoalStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "goals", indexes = {
        @Index(name = "idx_goals_user_id", columnList = "user_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_goals_user_active_title", columnNames = {"user_id", "active_title_key"})
})
public class GoalEntity {
    @Id
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    private UserEntity user;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(name = "active_title_key", length = 300)
    private String activeTitleKey;
    @Column(length = 200)
    private String description;
    @Column(nullable = false, length = 80)
    private String category;
    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GoalStatus status;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        updateActiveTitleKey();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
        updateActiveTitleKey();
    }

    private void updateActiveTitleKey() {
        activeTitleKey = status == GoalStatus.ACTIVE ?
                com.errorcapa8.ailifequest.domain.valueobject.TitleNormalizer.normalize(title) : null;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UserEntity getUser() { return user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }
}
