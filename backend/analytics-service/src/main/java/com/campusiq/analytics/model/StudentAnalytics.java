package com.campusiq.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_analytics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Builder.Default
    private Integer totalContests = 0;

    @Builder.Default
    private Integer totalSubmissions = 0;

    @Builder.Default
    private Double averageScore = 0.0;

    @Builder.Default
    private Double highestScore = 0.0;

    @Column(length = 1000)
    private String strongSubjects;

    @Column(length = 1000)
    private String weakSubjects;

    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
