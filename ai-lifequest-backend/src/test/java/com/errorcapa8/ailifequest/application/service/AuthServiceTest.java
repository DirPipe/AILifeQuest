package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.RegisterRequestDTO;
import com.errorcapa8.ailifequest.application.exception.ConflictException;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.repositoryimpl.UserCredentialsRepository;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;

class AuthServiceTest {

    @Test
    void registrationRejectsExistingEmailRegardlessOfInputCase() {
        InMemoryUserRepository users = new InMemoryUserRepository();
        users.save(new User(new UserId(UUID.randomUUID()), "Ana", "ana@example.com"));
        RecordingCredentialsRepository credentials = new RecordingCredentialsRepository();
        AuthService authService = new AuthService(users, credentials, new PasswordHasher());

        assertThatThrownBy(() -> authService.register(new RegisterRequestDTO("Ana", " ANA@EXAMPLE.COM ", "secret1")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("registrado");
        assertThat(credentials.saveCalls).isZero();
    }

    private static final class RecordingCredentialsRepository extends UserCredentialsRepository {
        private int saveCalls;

        private RecordingCredentialsRepository() {
            super(null);
        }

        @Override
        public User saveNewUser(User user, String passwordHash) {
            saveCalls++;
            return user;
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
            return users.values().stream().filter(user -> user.getEmail().equals(email)).findFirst();
        }

        @Override
        public boolean existsByEmail(String email) {
            return findByEmail(email).isPresent();
        }
    }
}
