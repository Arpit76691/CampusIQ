package com.campusiq.evaluation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long submissionId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long contestId;

    @Column(nullable = false)
    private Long problemId;

    @Column(nullable = false)
    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(nullable = false)
    private LocalDateTime evaluatedAt;
}
