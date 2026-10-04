package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.request.CreateGoalRequestDTO;
import com.errorcapa8.ailifequest.application.dto.request.UpdateGoalRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.GoalResponseDTO;
import com.errorcapa8.ailifequest.application.exception.NotFoundException;
import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import com.errorcapa8.ailifequest.domain.exception.DomainException;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.model.User;
import com.errorcapa8.ailifequest.domain.repository.GoalRepository;
import com.errorcapa8.ailifequest.domain.repository.UserRepository;
import com.errorcapa8.ailifequest.domain.valueobject.GoalId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GoalResponseDTO createGoal(CreateGoalRequestDTO request) {
        UserId userId = new UserId(request.userId());
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Usuario no encontrado."));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new DomainException("Un usuario inactivo no puede crear nuevas metas.");
        }
        Goal goal = new Goal(new GoalId(UUID.randomUUID()), userId, request.title(), request.description(), request.category(), request.targetDate());
        return DtoMapper.toGoalResponse(goalRepository.save(goal));
    }

    @Transactional(readOnly = true)
    public List<GoalResponseDTO> findByUserId(UUID userId) {
        return goalRepository.findByUserId(new UserId(userId)).stream()
                .map(DtoMapper::toGoalResponse)
                .toList();
    }

    @Transactional
    public GoalResponseDTO updateGoal(UUID goalIdValue, UpdateGoalRequestDTO request) {
        Goal goal = goalRepository.findById(new GoalId(goalIdValue))
                .orElseThrow(() -> new NotFoundException("Meta no encontrada."));
        UserId userId = new UserId(request.userId());
        if (!goal.getUserId().equals(userId)) {
            throw new DomainException("La meta no pertenece al usuario indicado.");
        }
        goal.updateDetails(request.title(), request.description(), request.category(), request.targetDate());
        return DtoMapper.toGoalResponse(goalRepository.save(goal));
    }
}
