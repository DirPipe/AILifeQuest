package com.errorcapa8.ailifequest.infrastructure.repositoryimpl;

import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.entity.UserEntity;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataUserRepository;
import com.errorcapa8.ailifequest.infrastructure.mapper.UserMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {
    private static final String UNSET_PASSWORD_HASH = "UNSET_BY_AUTH_SERVICE";
    private final SpringDataUserRepository springDataUserRepository;

    public UserRepositoryImpl(SpringDataUserRepository springDataUserRepository) {
        this.springDataUserRepository = springDataUserRepository;
    }

    @Override
    public User save(User user) {
        UserEntity entity = springDataUserRepository.findById(user.getId().value())
                .orElseGet(() -> UserMapper.toEntity(user, UNSET_PASSWORD_HASH));
        UserMapper.copyDomainToEntity(user, entity);
        return UserMapper.toDomain(springDataUserRepository.save(entity));
    }

    @Override
    public Optional<User> findById(UserId id) {
        return springDataUserRepository.findById(id.value()).map(UserMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return springDataUserRepository.findByEmail(email).map(UserMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return springDataUserRepository.existsByEmail(email);
    }
}
