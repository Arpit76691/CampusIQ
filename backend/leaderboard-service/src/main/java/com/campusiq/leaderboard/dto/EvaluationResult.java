package com.campusiq.leaderboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResult {

    private Long submissionId;
    private Long userId;
    private Long contestId;
    private Long problemId;
    private Double score;
    private String feedback;
    private LocalDateTime evaluatedAt;
}
