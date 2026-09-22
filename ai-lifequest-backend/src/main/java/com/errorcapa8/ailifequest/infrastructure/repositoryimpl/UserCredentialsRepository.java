package com.errorcapa8.ailifequest.infrastructure.repositoryimpl;

import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.infrastructure.entity.UserEntity;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataUserRepository;
import com.errorcapa8.ailifequest.infrastructure.mapper.UserMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserCredentialsRepository {
    private final SpringDataUserRepository springDataUserRepository;

    public UserCredentialsRepository(SpringDataUserRepository springDataUserRepository) {
        this.springDataUserRepository = springDataUserRepository;
    }

    public User saveNewUser(User user, String passwordHash) {
        UserEntity entity = UserMapper.toEntity(user, passwordHash);
        return UserMapper.toDomain(springDataUserRepository.save(entity));
    }

    public Optional<String> findPasswordHashByEmail(String email) {
        return springDataUserRepository.findByEmail(email).map(UserEntity::getPasswordHash);
    }
}
