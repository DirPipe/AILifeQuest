package com.errorcapa8.ailifequest.presentation.controller;

import com.errorcapa8.ailifequest.application.dto.request.CreateGoalRequestDTO;
import com.errorcapa8.ailifequest.application.dto.response.GoalResponseDTO;
import com.errorcapa8.ailifequest.application.service.GoalService;
import com.errorcapa8.ailifequest.presentation.globalhandler.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GoalControllerValidationTest {
    private final RecordingGoalService goalService = new RecordingGoalService();

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new GoalController(goalService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void rejectsEmptyTargetDateWithoutCallingService() throws Exception {
        mockMvc.perform(post("/api/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "b86cd5ed-8b0a-4db2-905e-676cf769cf81",
                                  "title": "Aprender Spring Boot",
                                  "description": "Completar el flujo backend del Sprint 1",
                                  "category": "Backend",
                                  "targetDate": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("targetDate")));

        org.assertj.core.api.Assertions.assertThat(goalService.wasCalled()).isFalse();
    }

    private static final class RecordingGoalService extends GoalService {
        private boolean called;

        private RecordingGoalService() {
            super(null, null);
        }

        @Override
        public GoalResponseDTO createGoal(CreateGoalRequestDTO request) {
            called = true;
            return null;
        }

        private boolean wasCalled() {
            return called;
        }
    }
}
