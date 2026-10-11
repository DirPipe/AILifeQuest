package com.errorcapa8.ailifequest.infrastructure;

import com.errorcapa8.ailifequest.domain.enums.ChallengeStatus;
import com.errorcapa8.ailifequest.domain.enums.GoalStatus;
import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import com.errorcapa8.ailifequest.infrastructure.entity.ChallengeEntity;
import com.errorcapa8.ailifequest.infrastructure.entity.GoalEntity;
import com.errorcapa8.ailifequest.infrastructure.entity.UserEntity;
import jakarta.persistence.EntityManager;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=create-drop")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers(disabledWithoutDocker = true)
class PostgreSqlConstraintIntegrationTest {
    @Container
    private static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Test
    void postgresRejectsDuplicateNormalizedActiveGoalForSameUser() {
        UserEntity user = persistUser("goal-owner@example.com");
        entityManager.persist(goal(user.getId(), "Aprender Java", GoalStatus.ACTIVE));
        entityManager.flush();

        assertConstraint("uk_goals_user_active_title", () -> {
            entityManager.persist(goal(user.getId(), " aprender   java ", GoalStatus.ACTIVE));
            entityManager.flush();
        });
    }

    @Test
    void postgresAllowsSameGoalTitleForDifferentUsersAndAfterCompletion() {
        UserEntity firstUser = persistUser("first-owner@example.com");
        UserEntity secondUser = persistUser("second-owner@example.com");
        GoalEntity firstActiveGoal = goal(firstUser.getId(), "Aprender Java", GoalStatus.ACTIVE);
        entityManager.persist(firstActiveGoal);
        entityManager.flush();

        entityManager.persist(goal(secondUser.getId(), "Aprender Java", GoalStatus.ACTIVE));
        firstActiveGoal.setStatus(GoalStatus.COMPLETED);
        entityManager.flush();
        entityManager.persist(goal(firstUser.getId(), "Aprender Java", GoalStatus.ACTIVE));
        entityManager.flush();
    }

    @Test
    void postgresRejectsDuplicateNormalizedPendingChallengeInOneGoal() {
        UserEntity user = persistUser("challenge-owner@example.com");
        GoalEntity goal = goal(user.getId(), "Meta", GoalStatus.ACTIVE);
        entityManager.persist(goal);
        entityManager.flush();
        entityManager.persist(challenge(goal.getId(), "Leer libro", ChallengeStatus.AVAILABLE));
        entityManager.flush();

        assertConstraint("uk_challenges_goal_pending_title", () -> {
            entityManager.persist(challenge(goal.getId(), " LEER   LIBRO ", ChallengeStatus.IN_PROGRESS));
            entityManager.flush();
        });
    }

    @Test
    void postgresAllowsReusingCompletedChallengeTitle() {
        UserEntity user = persistUser("completed-challenge-owner@example.com");
        GoalEntity goal = goal(user.getId(), "Meta", GoalStatus.ACTIVE);
        entityManager.persist(goal);
        entityManager.flush();
        entityManager.persist(challenge(goal.getId(), "Leer libro", ChallengeStatus.COMPLETED));
        entityManager.flush();

        entityManager.persist(challenge(goal.getId(), "Leer libro", ChallengeStatus.AVAILABLE));
        entityManager.flush();
    }

    @Test
    void postgresRejectsChallengeWithZeroXpReward() {
        UserEntity user = persistUser("zero-xp-challenge-owner@example.com");
        GoalEntity goal = goal(user.getId(), "Meta", GoalStatus.ACTIVE);
        entityManager.persist(goal);
        entityManager.flush();

        ChallengeEntity challenge = challenge(goal.getId(), "Reto sin recompensa", ChallengeStatus.AVAILABLE);
        challenge.setXpReward(0);
        assertConstraint("ck_challenges_xp_reward_positive", () -> {
            entityManager.persist(challenge);
            entityManager.flush();
        });
    }

    @Test
    void postgresRejectsDuplicateUserEmail() {
        persistUser("duplicate@example.com");

        assertConstraint("uk_users_email", () -> {
            entityManager.persist(user("duplicate@example.com"));
            entityManager.flush();
        });
    }

    @Test
    void postgresEnforcesRequiredGoalTargetDate() {
        UserEntity user = persistUser("required-date-owner@example.com");
        LocalDateTime now = LocalDateTime.now();

        assertThat(catchThrowable(() -> jdbcTemplate.update("""
                insert into goals (id, user_id, title, description, category, target_date, status, created_at, updated_at)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, UUID.randomUUID(), user.getId(), "Meta sin fecha", "Prueba", "Testing", null,
                GoalStatus.ACTIVE.name(), Timestamp.valueOf(now), Timestamp.valueOf(now))))
                .isNotNull();
    }

    private UserEntity persistUser(String email) {
        UserEntity user = user(email);
        entityManager.persist(user);
        entityManager.flush();
        return user;
    }

    private UserEntity user(String email) {
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setName("Test user");
        user.setEmail(email);
        user.setPasswordHash("test-hash");
        user.setTotalXp(0);
        user.setStatus(UserStatus.ACTIVE);
        return user;
    }

    private GoalEntity goal(UUID userId, String title, GoalStatus status) {
        GoalEntity goal = new GoalEntity();
        goal.setId(UUID.randomUUID());
        goal.setUserId(userId);
        goal.setTitle(title);
        goal.setDescription("Test goal");
        goal.setCategory("Testing");
        goal.setTargetDate(LocalDate.now().plusDays(7));
        goal.setStatus(status);
        return goal;
    }

    private ChallengeEntity challenge(UUID goalId, String title, ChallengeStatus status) {
        ChallengeEntity challenge = new ChallengeEntity();
        challenge.setId(UUID.randomUUID());
        challenge.setGoalId(goalId);
        challenge.setTitle(title);
        challenge.setDescription("Test challenge");
        challenge.setXpReward(10);
        challenge.setStatus(status);
        return challenge;
    }

    private void assertConstraint(String expectedConstraint, org.assertj.core.api.ThrowableAssert.ThrowingCallable action) {
        Throwable failure = catchThrowable(action);
        assertThat(failure).isNotNull();
        assertThat(findConstraintName(failure)).isEqualTo(expectedConstraint);
    }

    private String findConstraintName(Throwable failure) {
        Throwable cause = failure;
        while (cause != null) {
            if (cause instanceof ConstraintViolationException violation) {
                return violation.getConstraintName();
            }
            cause = cause.getCause();
        }
        return null;
    }
}
