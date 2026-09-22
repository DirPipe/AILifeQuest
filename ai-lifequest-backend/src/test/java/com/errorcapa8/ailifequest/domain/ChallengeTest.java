package com.errorcapa8.ailifequest.domain;

import com.errorcapa8.ailifequest.domain.enums.ChallengeStatus;
import com.errorcapa8.ailifequest.domain.exception.ChallengeAlreadyCompletedException;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ChallengeTest {

    @Test
    void completeChallengeReturnsXpAndMarksCompleted() {
        Challenge challenge = new Challenge(new ChallengeId(UUID.randomUUID()), new GoalId(UUID.randomUUID()), "Leer", "Leer 10 paginas", new XP(10));

        XP reward = challenge.complete();

        assertThat(reward.value()).isEqualTo(10);
        assertThat(challenge.getStatus()).isEqualTo(ChallengeStatus.COMPLETED);
        assertThat(challenge.getCompletedAt()).isNotNull();
    }

    @Test
    void cannotCompleteTwice() {
        Challenge challenge = new Challenge(new ChallengeId(UUID.randomUUID()), new GoalId(UUID.randomUUID()), "Leer", null, new XP(10));
        challenge.complete();

        assertThatThrownBy(challenge::complete)
                .isInstanceOf(ChallengeAlreadyCompletedException.class);
    }

    @Test
    void cannotCompleteLockedChallenge() {
        Challenge challenge = new Challenge(
                new ChallengeId(UUID.randomUUID()),
                new GoalId(UUID.randomUUID()),
                "Leer",
                null,
                new XP(10),
                ChallengeStatus.LOCKED,
                null
        );

        assertThatThrownBy(challenge::complete)
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("bloqueado");
    }
}
