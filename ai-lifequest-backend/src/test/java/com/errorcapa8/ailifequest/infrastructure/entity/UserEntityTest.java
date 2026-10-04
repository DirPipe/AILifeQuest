package com.errorcapa8.ailifequest.infrastructure.entity;

import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserEntityTest {

    @Test
    void onUpdateSetsDeactivatedAtWhenStatusIsInactive() {
        UserEntity entity = new UserEntity();
        entity.setStatus(UserStatus.INACTIVE);

        entity.onUpdate();

        assertThat(entity.getDeactivatedAt()).isNotNull();
    }

    @Test
    void onCreateSetsDeactivatedAtWhenStatusIsInactive() {
        UserEntity entity = new UserEntity();
        entity.setStatus(UserStatus.INACTIVE);

        entity.onCreate();

        assertThat(entity.getDeactivatedAt()).isNotNull();
    }
}
