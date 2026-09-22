package com.errorcapa8.ailifequest.domain.repository;

import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;

import java.util.List;
import java.util.Optional;

public interface GoalRepository {
    Goal save(Goal goal);

    Optional<Goal> findById(GoalId id);

    List<Goal> findByUserId(UserId userId);
}
