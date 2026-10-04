package com.errorcapa8.ailifequest.infrastructure.mapper;

import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.entity.UserEntity;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserMapperTest {

    @Test
    void copyDomainToEntitySetsDeactivatedAtWhenUserIsInactive() {
        User user = new User(new UserId(UUID.randomUUID()), "Ana", "ana@example.com");
        UserEntity entity = UserMapper.toEntity(user, "hash");
        user.deactivate();

        UserMapper.copyDomainToEntity(user, entity);

        assertThat(entity.getDeactivatedAt()).isNotNull();
    }

    @Test
    void copyDomainToEntityKeepsExistingDeactivatedAt() {
        User user = new User(new UserId(UUID.randomUUID()), "Ana", "ana@example.com");
        UserEntity entity = UserMapper.toEntity(user, "hash");
        LocalDateTime originalDeactivatedAt = LocalDateTime.now().minusDays(1);
        entity.setDeactivatedAt(originalDeactivatedAt);
        user.deactivate();

        UserMapper.copyDomainToEntity(user, entity);

        assertThat(entity.getDeactivatedAt()).isEqualTo(originalDeactivatedAt);
    }
}
