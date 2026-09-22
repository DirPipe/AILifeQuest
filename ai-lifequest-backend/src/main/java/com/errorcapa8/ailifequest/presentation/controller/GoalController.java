package com.errorcapa8.ailifequest.presentation.controller;

import com.errorcapa8.ailifequest.application.dto.request.CreateGoalRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.GoalResponseDTO;
import com.errorcapa8.ailifequest.application.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalResponseDTO createGoal(@Valid @RequestBody CreateGoalRequestDTO request) {
        return goalService.createGoal(request);
    }

    @GetMapping
    public List<GoalResponseDTO> findByUserId(@RequestParam UUID userId) {
        return goalService.findByUserId(userId);
    }
}
