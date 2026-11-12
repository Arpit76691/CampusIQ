package com.campusiq.analytics.service;

import com.campusiq.analytics.dto.ContestEvent;
import com.campusiq.analytics.dto.DashboardStats;
import com.campusiq.analytics.dto.EvaluationResult;
import com.campusiq.analytics.model.ContestAnalytics;
import com.campusiq.analytics.model.StudentAnalytics;
import com.campusiq.analytics.repository.ContestAnalyticsRepository;
import com.campusiq.analytics.repository.StudentAnalyticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final ContestAnalyticsRepository contestAnalyticsRepository;
    private final StudentAnalyticsRepository studentAnalyticsRepository;

    @Transactional
    public void processContestEnded(ContestEvent event) {
        log.info("Processing contest ended event for contestId: {}", event.getContestId());
        ContestAnalytics analytics = contestAnalyticsRepository
                .findByContestId(event.getContestId())
                .orElse(ContestAnalytics.builder()
                        .contestId(event.getContestId())
                        .title(event.getTitle())
                        .subject(event.getSubject())
                        .totalParticipants(0)
                        .averageScore(0.0)
                        .highestScore(0.0)
                        .lowestScore(100.0)
                        .medianScore(0.0)
                        .completionRate(0.0)
                        .build());
        analytics.setAnalyzedAt(LocalDateTime.now());
        contestAnalyticsRepository.save(analytics);
    }

    @Transactional
    public void processEvaluationResult(EvaluationResult result) {
        log.info("Processing evaluation result for userId: {}, contestId: {}", result.getUserId(), result.getContestId());

        // Update contest analytics
        contestAnalyticsRepository.findByContestId(result.getContestId()).ifPresent(ca -> {
            int prevTotal = ca.getTotalParticipants();
            double prevAvg = ca.getAverageScore();
            double newScore = result.getScore().doubleValue();

            ca.setTotalParticipants(prevTotal + 1);
            ca.setAverageScore(((prevAvg * prevTotal) + newScore) / (prevTotal + 1));
            if (newScore > ca.getHighestScore()) ca.setHighestScore(newScore);
            if (newScore < ca.getLowestScore()) ca.setLowestScore(newScore);
            ca.setAnalyzedAt(LocalDateTime.now());
            contestAnalyticsRepository.save(ca);
        });

        // Update or create student analytics
        StudentAnalytics sa = studentAnalyticsRepository.findByUserId(result.getUserId())
                .orElse(StudentAnalytics.builder()
                        .userId(result.getUserId())
                        .totalContests(0)
                        .totalSubmissions(0)
                        .averageScore(0.0)
                        .highestScore(0.0)
                        .strongSubjects("")
                        .weakSubjects("")
                        .build());

        double newScore = result.getScore().doubleValue();
        int prevSubmissions = sa.getTotalSubmissions();
        sa.setTotalSubmissions(prevSubmissions + 1);
        sa.setAverageScore(((sa.getAverageScore() * prevSubmissions) + newScore) / (prevSubmissions + 1));
        if (newScore > sa.getHighestScore()) sa.setHighestScore(newScore);
        sa.setLastUpdated(LocalDateTime.now());
        studentAnalyticsRepository.save(sa);
    }

    public Optional<ContestAnalytics> getContestAnalytics(Long contestId) {
        return contestAnalyticsRepository.findByContestId(contestId);
    }

    public Optional<StudentAnalytics> getStudentAnalytics(Long userId) {
        return studentAnalyticsRepository.findByUserId(userId);
    }

    public DashboardStats getDashboardStats() {
        List<ContestAnalytics> contests = contestAnalyticsRepository.findAll();
        List<StudentAnalytics> students = studentAnalyticsRepository.findAll();

        double avgScore = students.stream()
                .mapToDouble(StudentAnalytics::getAverageScore)
                .average().orElse(0.0);

        List<DashboardStats.StudentSummary> top = studentAnalyticsRepository
                .findTop10ByOrderByAverageScoreDesc().stream()
                .map(s -> DashboardStats.StudentSummary.builder()
                        .userId(s.getUserId())
                        .averageScore(s.getAverageScore())
                        .build())
                .collect(Collectors.toList());

        return DashboardStats.builder()
                .totalContests(contests.size())
                .totalStudents(students.size())
                .averagePlatformScore(avgScore)
                .topPerformers(top)
                .build();
    }

    public List<ContestAnalytics> getTopContests() {
        return contestAnalyticsRepository.findTop10ByOrderByAverageScoreDesc();
    }

    public List<StudentAnalytics> getTopStudents() {
        return studentAnalyticsRepository.findTop10ByOrderByAverageScoreDesc();
    }
}
