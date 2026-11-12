package com.campusiq.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contest_analytics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long contestId;

    private String title;

    private String subject;

    @Builder.Default
    private Integer totalParticipants = 0;

    @Builder.Default
    private Double averageScore = 0.0;

    @Builder.Default
    private Double highestScore = 0.0;

    @Builder.Default
    private Double lowestScore = 0.0;

    @Builder.Default
    private Double medianScore = 0.0;

    @Builder.Default
    private Double completionRate = 0.0;

    private LocalDateTime analyzedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.analyzedAt = LocalDateTime.now();
    }
}
