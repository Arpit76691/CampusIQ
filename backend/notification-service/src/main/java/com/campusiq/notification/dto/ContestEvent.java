package com.campusiq.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestEvent {

    private Long contestId;
    private String title;
    private String subject;
    private String eventType;
    private LocalDateTime timestamp;
}
