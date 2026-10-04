package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.CreateGoalRequestDTO;
import com.errorcapa8.ailifequest.application.dto.request.UpdateGoalRequestDTO;
import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.GoalRepository;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GoalServiceTest {
    private final InMemoryGoalRepository goalRepository = new InMemoryGoalRepository();
    private final InMemoryUserRepository userRepository = new InMemoryUserRepository();
    private final GoalService goalService = new GoalService(goalRepository, userRepository);

    @Test
    void createGoalRejectsInactiveUser() {
        UUID userId = UUID.randomUUID();
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com", new XP(0), UserStatus.INACTIVE));

        assertThatThrownBy(() -> goalService.createGoal(new CreateGoalRequestDTO(userId, "Meta", null, "Salud", null)))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("inactivo");
    }

    @Test
    void updateGoalChangesEditableFieldsWhenItBelongsToUser() {
        UUID userId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        LocalDate targetDate = LocalDate.now().plusDays(10);
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(userId), "Meta", null, "Salud", null));

        var response = goalService.updateGoal(goalId, new UpdateGoalRequestDTO(userId, "Meta editada", "Desc", "Estudio", targetDate));

        assertThat(response.title()).isEqualTo("Meta editada");
        assertThat(response.description()).isEqualTo("Desc");
        assertThat(response.category()).isEqualTo("Estudio");
        assertThat(response.targetDate()).isEqualTo(targetDate);
    }

    @Test
    void updateGoalRejectsDifferentOwner() {
        UUID ownerId = UUID.randomUUID();
        UUID requesterId = UUID.randomUUID();
        UUID goalId = UUID.randomUUID();
        goalRepository.save(new Goal(new GoalId(goalId), new UserId(ownerId), "Meta", null, "Salud", null));

        assertThatThrownBy(() -> goalService.updateGoal(goalId, new UpdateGoalRequestDTO(requesterId, "Meta editada", null, null, null)))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("no pertenece");
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
