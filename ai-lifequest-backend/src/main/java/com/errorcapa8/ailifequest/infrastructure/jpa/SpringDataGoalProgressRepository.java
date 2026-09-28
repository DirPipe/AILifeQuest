package com.errorcapa8.ailifequest.infrastructure.jpa;

import com.errorcapa8.ailifequest.infrastructure.entity.GoalProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataGoalProgressRepository extends JpaRepository<GoalProgressEntity, UUID> {
    Optional<GoalProgressEntity> findByGoalId(UUID goalId);
}
