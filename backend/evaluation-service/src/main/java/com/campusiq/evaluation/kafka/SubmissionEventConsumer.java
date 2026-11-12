package com.campusiq.evaluation.kafka;

import com.campusiq.evaluation.dto.SubmissionEvent;
import com.campusiq.evaluation.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SubmissionEventConsumer {

    private final EvaluationService evaluationService;

    @KafkaListener(topics = "submission.created", groupId = "evaluation-service")
    public void consumeSubmission(SubmissionEvent event) {
        log.info("Received submission event for submissionId: {}", event.getSubmissionId());
        try {
            evaluationService.evaluateSubmission(event);
        } catch (Exception e) {
            log.error("Error evaluating submission {}: {}", event.getSubmissionId(), e.getMessage(), e);
        }
    }
}
