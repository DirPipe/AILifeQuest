package com.errorcapa8.ailifequest.application.service;

import com.errorcapa8.ailifequest.application.dto.response.ChallengeResponseDTO;
import com.errorcapa8.ailifequest.application.dto.response.GoalResponseDTO;
import com.errorcapa8.ailifequest.application.dto.response.UserResponseDTO;
import com.errorcapa8.ailifequest.domain.model.Challenge;
import com.errorcapa8.ailifequest.domain.model.Goal;
import com.errorcapa8.ailifequest.domain.model.User;

final class DtoMapper {
    private DtoMapper() {
    }

    static UserResponseDTO toUserResponse(User user) {
        return new UserResponseDTO(user.getId().value(), user.getName(), user.getEmail(), user.getTotalXp().value(), user.getStatus().name());
    }

    static GoalResponseDTO toGoalResponse(Goal goal) {
        return new GoalResponseDTO(
                goal.getId().value(),
                goal.getUserId().value(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getCategory(),
                goal.getTargetDate(),
                goal.getProgress().percentage(),
                goal.getStatus().name()
        );
    }

    static ChallengeResponseDTO toChallengeResponse(Challenge challenge) {
        return new ChallengeResponseDTO(
                challenge.getId().value(),
                challenge.getGoalId().value(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getXpReward().value(),
                challenge.getStatus().name(),
                challenge.getCompletedAt()
        );
    }
}
