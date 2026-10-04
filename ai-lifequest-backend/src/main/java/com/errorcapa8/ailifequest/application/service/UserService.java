package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.UpdateUserRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.UserResponseDTO;
import com.errorcapa8.ailifequest.application.exception.NotFoundException;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.User;
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

    @Transactional
    public UserResponseDTO updateUser(UUID userIdValue, UpdateUserRequestDTO request) {
        UserId userId = new UserId(userIdValue);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));

        String normalizedEmail = request.email() == null ? null : request.email().trim().toLowerCase();
        if (normalizedEmail != null && !normalizedEmail.equals(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new DomainException("El email ya se encuentra registrado.");
        }

        user.updateProfile(request.name(), normalizedEmail);
        return DtoMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO deactivateUser(UUID userIdValue) {
        User user = userRepository.findById(new UserId(userIdValue))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));
        user.deactivate();
        return DtoMapper.toUserResponse(userRepository.save(user));
    }
}
