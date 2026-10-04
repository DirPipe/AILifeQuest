package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.UpdateUserRequestDTO;
import com.errorcapa8.ailifequest.application.exception.NotFoundException;
import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserServiceTest {
    private final InMemoryUserRepository userRepository = new InMemoryUserRepository();
    private final UserService userService = new UserService(userRepository);

    @Test
    void updateUserChangesEditableFields() {
        UUID userId = UUID.randomUUID();
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com"));

        var response = userService.updateUser(userId, new UpdateUserRequestDTO("Ana Nueva", "ANA.NEW@example.com"));

        assertThat(response.name()).isEqualTo("Ana Nueva");
        assertThat(response.email()).isEqualTo("ana.new@example.com");
    }

    @Test
    void updateUserRejectsDuplicatedEmail() {
        UUID userId = UUID.randomUUID();
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com"));
        userRepository.save(new User(new UserId(UUID.randomUUID()), "Luis", "used@example.com"));

        assertThatThrownBy(() -> userService.updateUser(userId, new UpdateUserRequestDTO(null, "used@example.com")))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("email");
    }

    @Test
    void updateUserValidatesUserExists() {
        UUID userId = UUID.randomUUID();

        assertThatThrownBy(() -> userService.updateUser(userId, new UpdateUserRequestDTO("Ana", null)))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deactivateUserMarksUserInactive() {
        UUID userId = UUID.randomUUID();
        userRepository.save(new User(new UserId(userId), "Ana", "ana@example.com"));

        var response = userService.deactivateUser(userId);

        assertThat(response.status()).isEqualTo(UserStatus.INACTIVE.name());
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
            return users.values().stream()
                    .filter(user -> user.getEmail().equals(email))
                    .findFirst();
        }

        @Override
        public boolean existsByEmail(String email) {
            return findByEmail(email).isPresent();
        }
    }
}
