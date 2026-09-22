package com.errorcapa8.ailifequest.presentation.controller;

import com.errorcapa8.ailifequest.application.dto.request.CompleteChallengeRequestDTO;
import com.errorcapa8.ailifequest.application.dto.request.CreateChallengeRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.ChallengeResponseDTO;
import com.errorcapa8.ailifequest.application.dto.response.GameProgressResponseDTO;
import com.errorcapa8.ailifequest.application.service.ChallengeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {
    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeResponseDTO createChallenge(@Valid @RequestBody CreateChallengeRequestDTO request) {
        return challengeService.createChallenge(request);
    }

    @GetMapping
    public List<ChallengeResponseDTO> findByGoalId(@RequestParam UUID goalId) {
        return challengeService.findByGoalId(goalId);
    }

    @PatchMapping("/complete")
    public GameProgressResponseDTO completeChallenge(@Valid @RequestBody CompleteChallengeRequestDTO request) {
        return challengeService.completeChallenge(request.challengeId());
    }
}
