package com.errorcapa8.ailifequest.infrastructure.mapper;

import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import com.errorcapa8.ailifequest.infrastructure.entity.ChallengeEntity;

public final class ChallengeMapper {
    private ChallengeMapper() {
    }

    public static Challenge toDomain(ChallengeEntity entity) {
        return new Challenge(
                new ChallengeId(entity.getId()),
                new GoalId(entity.getGoalId()),
                entity.getTitle(),
                entity.getDescription(),
                new XP(entity.getXpReward()),
                entity.getStatus(),
                entity.getCompletedAt()
        );
    }

    public static ChallengeEntity toEntity(Challenge challenge) {
        ChallengeEntity entity = new ChallengeEntity();
        copyDomainToEntity(challenge, entity);
        return entity;
    }

    public static void copyDomainToEntity(Challenge challenge, ChallengeEntity entity) {
        entity.setId(challenge.getId().value());
        entity.setGoalId(challenge.getGoalId().value());
        entity.setTitle(challenge.getTitle());
        entity.setDescription(challenge.getDescription());
        entity.setXpReward(challenge.getXpReward().value());
        entity.setStatus(challenge.getStatus());
        entity.setCompletedAt(challenge.getCompletedAt());
    }
}
