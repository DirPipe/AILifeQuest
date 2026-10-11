package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.CreateChallengeRequestDTO;
import com.errorcapa8.ailifequest.application.dto.request.UpdateChallengeRequestDTO;
import com.errorcapa8.ailifequest.application.exception.ConflictException;
import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import com.errorcapa8.ailifequest.domain.enums.GoalStatus;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.ChallengeRepository;
import com.errorcapa8.ailifequest.domain.repository.GoalRepository;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.repository.XpTransactionRepository;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.TitleNormalizer;
import com.errorcapa8.ailifequest.domain.valueobject.TitleNormalizer;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ChallengeServiceTest {
    private final InMemoryChallengeRepository challengeRepository = new InMemoryChallengeRepository();
    private final InMemoryGoalRepository goalRepository = new InMemoryGoalRepository();
    private final InMemoryUserRepository userRepository = new InMemoryUserRepository();
    private final XpTransactionRepository xpTransactionRepository = transaction -> transaction;
    private final ChallengeService challengeService = new ChallengeService(challengeRepository, goalRepository, userRepository, xpTransactionRepository);

    @Test
    void createChallengeRejectsInactiveUser() {
        UUID userId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(userId), "Meta", null, "Salud", LocalDate.now().plusDays(7)));
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com", new XP(0), UserStatus.INACTIVE));

        assertThatThrownBy(() -> challengeService.createChallenge(new CreateChallengeRequestDTO(goalId, "Reto", null, 10)))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("inactivo");
    }

    @Test
    void updateChallengeChangesEditableFieldsWhenItBelongsToGoal() {
        UUID userId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        UUID challengeId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(userId), "Meta", null, "Salud", LocalDate.now().plusDays(7)));
        challengeRepository.save(new Challenge(new ChallengeId(challengeId), new GoalId(goalId), "Reto", null, new XP(10)));

        var response = challengeService.updateChallenge(challengeId, new UpdateChallengeRequestDTO(goalId, "Reto editado", "Desc", 25));

        assertThat(response.title()).isEqualTo("Reto editado");
        assertThat(response.description()).isEqualTo("Desc");
        assertThat(response.xpReward()).isEqualTo(25);
    }

    @Test
    void updateChallengeRejectsDifferentGoal() {
        UUID goalId = UUID.randomUUID();
        UUID otherGoalId = UUID.randomUUID();
        UUID challengeId = UUID.randomUUID();
        challengeRepository.save(new Challenge(new ChallengeId(challengeId), new GoalId(goalId), "Reto", null, new XP(10)));

        assertThatThrownBy(() -> challengeService.updateChallenge(challengeId, new UpdateChallengeRequestDTO(otherGoalId, "Reto editado", null, null)))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("no pertenece");
    }

    @Test
    void createChallengeRejectsSamePendingTitleIgnoringCaseAndWhitespace() {
        UUID userId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(userId), "Meta", null, "Salud", LocalDate.now().plusDays(7)));
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com"));
        challengeRepository.save(new Challenge(new ChallengeId(UUID.randomUUID()), new GoalId(goalId),
                "Leer libro", null, new XP(10)));

        assertThatThrownBy(() -> challengeService.createChallenge(new CreateChallengeRequestDTO(
                goalId, " LEER   LIBRO ", null, 25)))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("reto pendiente");
    }

    @Test
    void samePendingChallengeTitleIsAllowedForAnotherGoal() {
        UUID userId = UUID.randomUUID();
        UUID firstGoalId = UUID.randomUUID();
        UUID secondGoalId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(firstGoalId), new UserId(userId), "Meta 1", null, "Salud", LocalDate.now().plusDays(7)));
        goalRepository.save(new Goal(new GoalId(secondGoalId), new UserId(userId), "Meta 2", null, "Salud", LocalDate.now().plusDays(14)));
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com"));
        challengeRepository.save(new Challenge(new ChallengeId(UUID.randomUUID()), new GoalId(firstGoalId),
                "Leer libro", null, new XP(10)));

        var created = challengeService.createChallenge(new CreateChallengeRequestDTO(
                secondGoalId, "Leer libro", null, 25));

        assertThat(created.title()).isEqualTo("Leer libro");
    }

    @Test
    void completedChallengeDoesNotReserveItsTitle() {
        UUID userId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(userId), "Meta", null, "Salud", LocalDate.now().plusDays(7)));
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com"));
        Challenge completed = new Challenge(new ChallengeId(UUID.randomUUID()), new GoalId(goalId),
                "Leer libro", null, new XP(10));
        completed.complete();
        challengeRepository.save(completed);

        var created = challengeService.createChallenge(new CreateChallengeRequestDTO(
                goalId, "Leer libro", null, 25));

        assertThat(created.status()).isEqualTo("AVAILABLE");
    }

    @Test
    void updateChallengeRejectsAnotherPendingChallengesTitle() {
        UUID userId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        UUID firstChallengeId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(userId), "Meta", null, "Salud", LocalDate.now().plusDays(7)));
        challengeRepository.save(new Challenge(new ChallengeId(firstChallengeId), new GoalId(goalId),
                "Reto 1", null, new XP(10)));
        challengeRepository.save(new Challenge(new ChallengeId(UUID.randomUUID()), new GoalId(goalId),
                "Reto 2", null, new XP(10)));

        assertThatThrownBy(() -> challengeService.updateChallenge(firstChallengeId,
                new UpdateChallengeRequestDTO(goalId, " reto   2 ", null, null)))
                .isInstanceOf(ConflictException.class);
        assertThat(challengeRepository.findById(new ChallengeId(firstChallengeId)).orElseThrow().getTitle())
                .isEqualTo("Reto 1");
    }

    private static final class InMemoryChallengeRepository implements ChallengeRepository {
        private final Map<ChallengeId, Challenge> challenges = new HashMap<>();

        @Override
        public Challenge save(Challenge challenge) {
            challenges.put(challenge.getId(), challenge);
            return challenge;
        }

        @Override
        public Optional<Challenge> findById(ChallengeId id) {
            return Optional.ofNullable(challenges.get(id));
        }

        @Override
        public List<Challenge> findByGoalId(GoalId goalId) {
            return challenges.values().stream()
                    .filter(challenge -> challenge.getGoalId().equals(goalId))
                    .toList();
        }

        @Override
        public boolean existsPendingTitle(GoalId goalId, String normalizedTitle, ChallengeId excludingChallengeId) {
            return challenges.values().stream()
                    .filter(challenge -> challenge.getGoalId().equals(goalId))
                    .filter(challenge -> !challenge.isCompleted())
                    .filter(challenge -> excludingChallengeId == null || !challenge.getId().equals(excludingChallengeId))
                    .anyMatch(challenge -> TitleNormalizer.normalize(challenge.getTitle()).equals(normalizedTitle));
        }
    }

    private static final class InMemoryGoalRepository implements GoalRepository {
        private final Map<GoalId, Goal> goals = new HashMap<>();

        @Override
        public Goal save(Goal goal) {
            goals.put(goal.getId(), goal);
            return goal;
        }

        @Override
        public Optional<Goal> findById(GoalId id) {
            return Optional.ofNullable(goals.get(id));
        }

        @Override
        public List<Goal> findByUserId(UserId userId) {
            return goals.values().stream()
                    .filter(goal -> goal.getUserId().equals(userId))
                    .toList();
        }

        @Override
        public boolean existsActiveTitle(UserId userId, String normalizedTitle, GoalId excludingGoalId) {
            return goals.values().stream()
                    .filter(goal -> goal.getUserId().equals(userId))
                    .filter(goal -> goal.getStatus() == GoalStatus.ACTIVE)
                    .filter(goal -> excludingGoalId == null || !goal.getId().equals(excludingGoalId))
                    .anyMatch(goal -> TitleNormalizer.normalize(goal.getTitle()).equals(normalizedTitle));
        }
    }

    private static final class InMemoryUserRepository implements UserRepository {
        private final Map<UserId, User> users = new HashMap<>();

        @Override
        public User save(User user) {
            users.put(user.getId(), user);
            return user;
        }

        @Override
        public Optional<User> findById(UserId id) {
            return Optional.ofNullable(users.get(id));
        }

        @Override
        public Optional<User> findByEmail(String email) {
            return users.values().stream()
                    .filter(user -> user.getEmail().equals(email))
                    .findFirst();
        }

        @Override
        public boolean existsByEmail(String email) {
            return findByEmail(email).isPresent();
        }
    }
}
