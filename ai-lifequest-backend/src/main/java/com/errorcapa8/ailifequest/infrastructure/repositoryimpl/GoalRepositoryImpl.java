package com.errorcapa8.ailifequest.infrastructure.repositoryimpl;

import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.repository.GoalRepository;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.entity.GoalEntity;
import com.errorcapa8.ailifequest.infrastructure.entity.GoalProgressEntity;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataChallengeRepository;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataGoalRepository;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataGoalProgressRepository;
import com.errorcapa8.ailifequest.infrastructure.mapper.ChallengeMapper;
import com.errorcapa8.ailifequest.infrastructure.mapper.GoalMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class GoalRepositoryImpl implements GoalRepository {
    private final SpringDataGoalRepository springDataGoalRepository;
    private final SpringDataChallengeRepository springDataChallengeRepository;
    private final SpringDataGoalProgressRepository springDataGoalProgressRepository;

    public GoalRepositoryImpl(SpringDataGoalRepository springDataGoalRepository,
                              SpringDataChallengeRepository springDataChallengeRepository,
                              SpringDataGoalProgressRepository springDataGoalProgressRepository) {
        this.springDataGoalRepository = springDataGoalRepository;
        this.springDataChallengeRepository = springDataChallengeRepository;
        this.springDataGoalProgressRepository = springDataGoalProgressRepository;
    }

    @Override
    public Goal save(Goal goal) {
        GoalEntity entity = springDataGoalRepository.findById(goal.getId().value()).orElseGet(GoalEntity::new);
        GoalMapper.copyDomainToEntity(goal, entity);
        GoalEntity savedGoal = springDataGoalRepository.save(entity);
        springDataGoalProgressRepository.save(toProgressEntity(goal));
        return toDomainWithChallenges(savedGoal);
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
        GoalProgressEntity progress = springDataGoalProgressRepository.findByGoalId(entity.getId()).orElse(null);
        return GoalMapper.toDomain(entity, progress, challenges);
    }

    private GoalProgressEntity toProgressEntity(Goal goal) {
        GoalProgressEntity entity = springDataGoalProgressRepository.findByGoalId(goal.getId().value())
                .orElseGet(() -> {
                    GoalProgressEntity newEntity = new GoalProgressEntity();
                    newEntity.setId(java.util.UUID.randomUUID());
                    newEntity.setGoalId(goal.getId().value());
                    return newEntity;
                });
        int totalChallenges = goal.getChallenges().size();
        int completedChallenges = (int) goal.getChallenges().stream()
                .filter(Challenge::isCompleted)
                .count();
        entity.setTotalChallenges(totalChallenges);
        entity.setCompletedChallenges(completedChallenges);
        entity.setProgressPercentage(goal.getProgress().percentage());
        return entity;
    }
}
