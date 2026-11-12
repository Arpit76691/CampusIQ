package com.campusiq.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardUpdate {

    private Long contestId;
    private List<Map<String, Object>> entries;
    private LocalDateTime updatedAt;
}
