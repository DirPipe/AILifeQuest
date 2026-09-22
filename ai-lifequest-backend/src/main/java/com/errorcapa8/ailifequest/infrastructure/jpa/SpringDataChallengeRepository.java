package com.errorcapa8.ailifequest.infrastructure.jpa;

import com.errorcapa8.ailifequest.infrastructure.entity.ChallengeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataChallengeRepository extends JpaRepository<ChallengeEntity, UUID> {
    List<ChallengeEntity> findByGoalId(UUID goalId);
}
