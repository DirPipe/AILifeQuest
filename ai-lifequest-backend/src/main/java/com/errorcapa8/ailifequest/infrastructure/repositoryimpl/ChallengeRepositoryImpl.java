package com.errorcapa8.ailifequest.infrastructure.repositoryimpl;

import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.repository.ChallengeRepository;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.infrastructure.entity.ChallengeEntity;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataChallengeRepository;
import com.errorcapa8.ailifequest.infrastructure.mapper.ChallengeMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ChallengeRepositoryImpl implements ChallengeRepository {
    private final SpringDataChallengeRepository springDataChallengeRepository;

    public ChallengeRepositoryImpl(SpringDataChallengeRepository springDataChallengeRepository) {
        this.springDataChallengeRepository = springDataChallengeRepository;
    }

    @Override
    public Challenge save(Challenge challenge) {
        ChallengeEntity entity = springDataChallengeRepository.findById(challenge.getId().value()).orElseGet(ChallengeEntity::new);
        ChallengeMapper.copyDomainToEntity(challenge, entity);
        return ChallengeMapper.toDomain(springDataChallengeRepository.save(entity));
    }

    @Override
    public Optional<Challenge> findById(ChallengeId id) {
        return springDataChallengeRepository.findById(id.value()).map(ChallengeMapper::toDomain);
    }

    @Override
    public List<Challenge> findByGoalId(GoalId goalId) {
        return springDataChallengeRepository.findByGoalId(goalId.value()).stream()
                .map(ChallengeMapper::toDomain)
                .toList();
    }
}
