package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.response.UserResponseDTO;
import com.errorcapa8.ailifequest.application.exception.NotFoundException;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUser(UUID userId) {
        return userRepository.findById(new UserId(userId))
                .map(DtoMapper::toUserResponse)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));
    }
}
