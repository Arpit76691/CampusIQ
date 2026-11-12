package com.campusiq.contest.dto;

import com.campusiq.contest.model.ContestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestResponse {

    private Long id;
    private String title;
    private String description;
    private String subject;
    private String difficulty;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ContestStatus status;
    private Long createdBy;
    private Integer maxParticipants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long problemCount;
}
