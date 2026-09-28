package com.errorcapa8.ailifequest.infrastructure.mapper;

import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.Progress;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.entity.GoalEntity;
import com.errorcapa8.ailifequest.infrastructure.entity.GoalProgressEntity;

import java.util.List;

public final class GoalMapper {
    private GoalMapper() {
    }

    public static Goal toDomain(GoalEntity entity, GoalProgressEntity progressEntity, List<Challenge> challenges) {
        Progress progress = progressEntity == null ? new Progress(0.0) : new Progress(progressEntity.getProgressPercentage());
        return new Goal(
                new GoalId(entity.getId()),
                new UserId(entity.getUserId()),
                entity.getTitle(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getTargetDate(),
                progress,
                entity.getStatus(),
                challenges
        );
    }

    public static GoalEntity toEntity(Goal goal) {
        GoalEntity entity = new GoalEntity();
        copyDomainToEntity(goal, entity);
        return entity;
    }

    public static void copyDomainToEntity(Goal goal, GoalEntity entity) {
        entity.setId(goal.getId().value());
        entity.setUserId(goal.getUserId().value());
        entity.setTitle(goal.getTitle());
        entity.setDescription(goal.getDescription());
        entity.setCategory(goal.getCategory());
        entity.setTargetDate(goal.getTargetDate());
        entity.setStatus(goal.getStatus());
    }
}
