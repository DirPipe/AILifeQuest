package com.errorcapa8.ailifequest.infrastructure.jpa;

import com.errorcapa8.ailifequest.infrastructure.entity.UserAchievementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataUserAchievementRepository extends JpaRepository<UserAchievementEntity, UUID> {
}
