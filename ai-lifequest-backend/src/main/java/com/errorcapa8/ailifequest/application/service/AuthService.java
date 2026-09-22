package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.LoginRequestDTO;
import com.errorcapa8.ailifequest.application.dto.request.RegisterRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.AuthResponseDTO;
import com.errorcapa8.ailifequest.application.exception.UnauthorizedException;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.infrastructure.repositoryimpl.UserCredentialsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordHasher passwordHasher;

    public AuthService(UserRepository userRepository,
                       UserCredentialsRepository userCredentialsRepository,
                       PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.userCredentialsRepository = userCredentialsRepository;
        this.passwordHasher = passwordHasher;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DomainException("El email ya se encuentra registrado.");
        }
        User user = new User(new UserId(UUID.randomUUID()), request.name().trim(), normalizedEmail);
        User saved = userCredentialsRepository.saveNewUser(user, passwordHasher.hash(request.password()));
        return toAuthResponse(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Credenciales incorrectas."));
        String passwordHash = userCredentialsRepository.findPasswordHashByEmail(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Credenciales incorrectas."));
        if (!passwordHasher.matches(request.password(), passwordHash)) {
            throw new UnauthorizedException("Credenciales incorrectas.");
        }
        return toAuthResponse(user);
    }

    private AuthResponseDTO toAuthResponse(User user) {
        return new AuthResponseDTO(user.getId().value(), user.getName(), user.getEmail(), user.getTotalXp().value(), user.getStatus().name());
    }
}
