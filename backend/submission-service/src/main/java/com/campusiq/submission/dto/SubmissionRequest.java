package com.campusiq.submission.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequest {

    @NotNull(message = "Contest ID is required")
    private Long contestId;

    @NotNull(message = "Problem ID is required")
    private Long problemId;

    @NotNull(message = "Answer is required")
    private String answer;

    private String language;
}
