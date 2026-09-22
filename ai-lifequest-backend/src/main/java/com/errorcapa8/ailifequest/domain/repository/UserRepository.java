package com.errorcapa8.ailifequest.domain.repository;

import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;

import java.util.Optional;

public interface UserRepository {
    User save(User user);

    Optional<User> findById(UserId id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
