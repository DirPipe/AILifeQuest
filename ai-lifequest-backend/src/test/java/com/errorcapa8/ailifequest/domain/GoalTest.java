package com.errorcapa8.ailifequest.domain;

import com.errorcapa8.ailifequest.domain.enums.GoalStatus;
import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class GoalTest {

    @Test
    void recalculatesProgressFromChallenges() {
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()), "Aprender Java", null, "Estudio", null);
        Challenge first = new Challenge(new ChallengeId(UUID.randomUUID()), goal.getId(), "Clase 1", null, new XP(10));
        Challenge second = new Challenge(new ChallengeId(UUID.randomUUID()), goal.getId(), "Clase 2", null, new XP(10));

        goal.addChallenge(first);
        goal.addChallenge(second);
        first.complete();
        goal.replaceChallenges(List.of(first, second));

        assertThat(goal.getProgress().percentage()).isEqualTo(50.0);
        assertThat(goal.getStatus()).isEqualTo(GoalStatus.IN_PROGRESS);
    }

    @Test
    void completingAllChallengesCompletesGoal() {
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), new UserId(UUID.randomUUID()), "Aprender Java", null, "Estudio", null);
        Challenge challenge = new Challenge(new ChallengeId(UUID.randomUUID()), goal.getId(), "Clase 1", null, new XP(10));

        challenge.complete();
        goal.addChallenge(challenge);

        assertThat(goal.getProgress().percentage()).isEqualTo(100.0);
        assertThat(goal.getStatus()).isEqualTo(GoalStatus.COMPLETED);
    }
}
