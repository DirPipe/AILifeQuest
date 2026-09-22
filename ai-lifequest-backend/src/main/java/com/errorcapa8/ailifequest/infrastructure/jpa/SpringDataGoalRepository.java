package com.errorcapa8.ailifequest.infrastructure.jpa;

import com.errorcapa8.ailifequest.infrastructure.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataGoalRepository extends JpaRepository<GoalEntity, UUID> {
    List<GoalEntity> findByUserId(UUID userId);
}
