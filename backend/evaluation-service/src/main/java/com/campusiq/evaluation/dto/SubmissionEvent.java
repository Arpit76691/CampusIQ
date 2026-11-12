package com.campusiq.evaluation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEvent {

    private Long submissionId;
    private Long userId;
    private Long contestId;
    private Long problemId;
    private String answer;
    private String language;
}
