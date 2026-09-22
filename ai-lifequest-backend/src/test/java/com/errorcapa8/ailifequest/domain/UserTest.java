package com.errorcapa8.ailifequest.domain;

import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserTest {

    @Test
    void addXpIncreasesTotalXp() {
        User user = new User(new UserId(UUID.randomUUID()), "Ana", "ana@example.com");

        user.addXp(new XP(25));

        assertThat(user.getTotalXp().value()).isEqualTo(25);
    }

    @Test
    void xpCannotBeNegative() {
        assertThatThrownBy(() -> new XP(-1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("XP");
    }
}
