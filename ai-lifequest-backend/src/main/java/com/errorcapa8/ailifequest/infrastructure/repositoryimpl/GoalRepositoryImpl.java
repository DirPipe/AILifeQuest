package com.errorcapa8.ailifequest.infrastructure.repositoryimpl;

import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.repository.GoalRepository;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.entity.GoalEntity;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataChallengeRepository;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataGoalRepository;
import com.errorcapa8.ailifequest.infrastructure.mapper.ChallengeMapper;
import com.errorcapa8.ailifequest.infrastructure.mapper.GoalMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class GoalRepositoryImpl implements GoalRepository {
    private final SpringDataGoalRepository springDataGoalRepository;
    private final SpringDataChallengeRepository springDataChallengeRepository;

    public GoalRepositoryImpl(SpringDataGoalRepository springDataGoalRepository,
                              SpringDataChallengeRepository springDataChallengeRepository) {
        this.springDataGoalRepository = springDataGoalRepository;
        this.springDataChallengeRepository = springDataChallengeRepository;
    }

    @Override
    public Goal save(Goal goal) {
        GoalEntity entity = springDataGoalRepository.findById(goal.getId().value()).orElseGet(GoalEntity::new);
        GoalMapper.copyDomainToEntity(goal, entity);
        return toDomainWithChallenges(springDataGoalRepository.save(entity));
    }

    @Override
    public Optional<Goal> findById(GoalId id) {
        return springDataGoalRepository.findById(id.value()).map(this::toDomainWithChallenges);
    }

    @Override
    public List<Goal> findByUserId(UserId userId) {
        return springDataGoalRepository.findByUserId(userId.value()).stream()
                .map(this::toDomainWithChallenges)
                .toList();
    }

    private Goal toDomainWithChallenges(GoalEntity entity) {
        List<Challenge> challenges = springDataChallengeRepository.findByGoalId(entity.getId()).stream()
                .map(ChallengeMapper::toDomain)
                .toList();
        return GoalMapper.toDomain(entity, challenges);
    }
}
