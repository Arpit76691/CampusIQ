package com.campusiq.submission.dto;

import com.campusiq.submission.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {

    private Long id;
    private Long userId;
    private Long contestId;
    private Long problemId;
    private String answer;
    private String language;
    private SubmissionStatus status;
    private Integer score;
    private LocalDateTime submittedAt;
    private LocalDateTime evaluatedAt;
}
