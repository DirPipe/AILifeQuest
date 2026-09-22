package com.errorcapa8.ailifequest.infrastructure.mapper;

import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import com.errorcapa8.ailifequest.infrastructure.entity.UserEntity;

public final class UserMapper {
    private UserMapper() {
    }

    public static User toDomain(UserEntity entity) {
        return new User(
                new UserId(entity.getId()),
                entity.getName(),
                entity.getEmail(),
                new XP(entity.getTotalXp()),
                entity.getStatus()
        );
    }

    public static UserEntity toEntity(User user, String passwordHash) {
        UserEntity entity = new UserEntity();
        entity.setId(user.getId().value());
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPasswordHash(passwordHash);
        entity.setTotalXp(user.getTotalXp().value());
        entity.setStatus(user.getStatus());
        return entity;
    }

    public static void copyDomainToEntity(User user, UserEntity entity) {
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setTotalXp(user.getTotalXp().value());
        entity.setStatus(user.getStatus());
    }
}
