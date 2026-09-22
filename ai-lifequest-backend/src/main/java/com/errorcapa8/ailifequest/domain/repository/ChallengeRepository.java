package com.errorcapa8.ailifequest.domain.repository;

import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository {
    Challenge save(Challenge challenge);

    Optional<Challenge> findById(ChallengeId id);

    List<Challenge> findByGoalId(GoalId goalId);
}
