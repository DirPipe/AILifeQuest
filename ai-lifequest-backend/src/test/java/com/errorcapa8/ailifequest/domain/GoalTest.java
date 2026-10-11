package com.errorcapa8.ailifequest.domain;

import com.errorcapa8.ailifequest.domain.enums.GoalStatus;
import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GoalTest {

    @Test
    void recalculatesProgressFromChallenges() {
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()), "Aprender Java", null, "Estudio", LocalDate.now().plusDays(7));
        Challenge first = new Challenge(new ChallengeId(UUID.randomUUID()), goal.getId(), "Clase 1", null, new XP(10));
        Challenge second = new Challenge(new ChallengeId(UUID.randomUUID()), goal.getId(), "Clase 2", null, new XP(10));

        goal.addChallenge(first);
        goal.addChallenge(second);
        first.complete();
        goal.replaceChallenges(List.of(first, second));

        assertThat(goal.getProgress().percentage()).isEqualTo(50.0);
        assertThat(goal.getStatus()).isEqualTo(GoalStatus.ACTIVE);
    }

    @Test
    void completingAllChallengesCompletesGoal() {
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()), "Aprender Java", null, "Estudio", LocalDate.now().plusDays(7));
        Challenge challenge = new Challenge(new ChallengeId(UUID.randomUUID()), goal.getId(), "Clase 1", null, new XP(10));

        challenge.complete();
        goal.addChallenge(challenge);

        assertThat(goal.getProgress().percentage()).isEqualTo(100.0);
        assertThat(goal.getStatus()).isEqualTo(GoalStatus.COMPLETED);
    }

    @Test
    void updateDetailsChangesEditableFields() {
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()), "Aprender Java", null, "Estudio", LocalDate.now().plusDays(7));
        LocalDate targetDate = LocalDate.now().plusDays(7);

        goal.updateDetails("  Aprender Spring  ", "Practicar APIs", "Backend", targetDate);

        assertThat(goal.getTitle()).isEqualTo("Aprender Spring");
        assertThat(goal.getDescription()).isEqualTo("Practicar APIs");
        assertThat(goal.getCategory()).isEqualTo("Backend");
        assertThat(goal.getTargetDate()).isEqualTo(targetDate);
    }

    @Test
    void rejectsMissingTargetDate() {
        assertThatThrownBy(() -> new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "Meta", null, "Estudio", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("fecha objetivo");
    }

    @Test
    void rejectsTitlesAndDescriptionsOverTheirLimits() {
        LocalDate targetDate = LocalDate.now().plusDays(7);

        assertThatThrownBy(() -> new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "t".repeat(101), null, "Estudio", targetDate))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("100");
        assertThatThrownBy(() -> new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "Meta", "d".repeat(201), "Estudio", targetDate))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("200");
    }

    @Test
    void categoryIsLimitedToEightyCharactersOnCreateAndUpdate() {
        Goal boundaryGoal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "Meta", null, "c".repeat(80), LocalDate.now().plusDays(7));
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "Meta", null, "Estudio", LocalDate.now().plusDays(7));

        assertThat(boundaryGoal.getCategory()).hasSize(80);
        assertThatThrownBy(() -> new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "Meta", null, "c".repeat(81), LocalDate.now().plusDays(7)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("80");
        assertThatThrownBy(() -> goal.updateDetails(null, null, "c".repeat(81), null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("80");
        assertThat(goal.getCategory()).isEqualTo("Estudio");
    }

    @Test
    void updateWithOmittedTargetDateKeepsExistingDate() {
        LocalDate targetDate = LocalDate.now().plusDays(7);
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()),
                "Meta", null, "Estudio", targetDate);

        goal.updateDetails("Meta editada", null, null, null);

        assertThat(goal.getTargetDate()).isEqualTo(targetDate);
    }
}
