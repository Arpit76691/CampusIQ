package com.campusiq.analytics.kafka;

import com.campusiq.analytics.dto.ContestEvent;
import com.campusiq.analytics.dto.EvaluationResult;
import com.campusiq.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyticsEventConsumer {

    private final AnalyticsService analyticsService;

    @KafkaListener(topics = "contest.ended", groupId = "analytics-service")
    public void consumeContestEnded(ContestEvent event) {
        log.info("Received contest.ended event for contestId: {}", event.getContestId());
        try {
            analyticsService.processContestEnded(event);
        } catch (Exception e) {
            log.error("Error processing contest ended event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "evaluation.completed", groupId = "analytics-service")
    public void consumeEvaluationCompleted(EvaluationResult result) {
        log.info("Received evaluation.completed event for submissionId: {}", result.getSubmissionId());
        try {
            analyticsService.processEvaluationResult(result);
        } catch (Exception e) {
            log.error("Error processing evaluation result: {}", e.getMessage(), e);
        }
    }
}
