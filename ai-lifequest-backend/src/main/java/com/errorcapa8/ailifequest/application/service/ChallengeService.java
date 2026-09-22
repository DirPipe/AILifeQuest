package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.CreateChallengeRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.ChallengeResponseDTO;
import com.errorcapa8.ailifequest.application.dto.response.GameProgressResponseDTO;
import com.errorcapa8.ailifequest.application.exception.NotFoundException;
import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.model.XpTransaction;
import com.errorcapa8.ailifequest.domain.repository.ChallengeRepository;
import com.errorcapa8.ailifequest.domain.repository.GoalRepository;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.repository.XpTransactionRepository;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final XpTransactionRepository xpTransactionRepository;

    public ChallengeService(ChallengeRepository challengeRepository,
                            GoalRepository goalRepository,
                            UserRepository userRepository,
                            XpTransactionRepository xpTransactionRepository) {
        this.challengeRepository = challengeRepository;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.xpTransactionRepository = xpTransactionRepository;
    }

    @Transactional
    public ChallengeResponseDTO createChallenge(CreateChallengeRequestDTO request) {
        GoalId goalId = new GoalId(request.goalId());
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new NotFoundException("Meta no encontrada."));
        Challenge challenge = new Challenge(new ChallengeId(UUID.randomUUID()), goalId, request.title(), request.description(), new XP(request.xpReward()));
        Challenge saved = challengeRepository.save(challenge);
        goal.addChallenge(saved);
        goalRepository.save(goal);
        return DtoMapper.toChallengeResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ChallengeResponseDTO> findByGoalId(UUID goalId) {
        return challengeRepository.findByGoalId(new GoalId(goalId)).stream()
                .map(DtoMapper::toChallengeResponse)
                .toList();
    }

    @Transactional
    public GameProgressResponseDTO completeChallenge(UUID challengeIdValue) {
        Challenge challenge = challengeRepository.findById(new ChallengeId(challengeIdValue))
                .orElseThrow(() -> new NotFoundException("Reto no encontrado."));
        XP earnedXp = challenge.complete();

        Goal goal = goalRepository.findById(challenge.getGoalId())
                .orElseThrow(() -> new NotFoundException("Meta no encontrada."));
        User user = userRepository.findById(goal.getUserId())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));

        user.addXp(earnedXp);
        challengeRepository.save(challenge);
        List<Challenge> challenges = challengeRepository.findByGoalId(goal.getId());
        goal.replaceChallenges(challenges);
        User savedUser = userRepository.save(user);
        Goal savedGoal = goalRepository.save(goal);
        xpTransactionRepository.save(XpTransaction.forCompletedChallenge(user.getId(), challenge.getId(), earnedXp));

        return new GameProgressResponseDTO(
                DtoMapper.toUserResponse(savedUser),
                DtoMapper.toGoalResponse(savedGoal),
                DtoMapper.toChallengeResponse(challenge),
                earnedXp.value()
        );
    }
}
