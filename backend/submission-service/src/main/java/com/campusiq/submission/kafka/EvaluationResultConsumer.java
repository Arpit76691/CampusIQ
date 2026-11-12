package com.campusiq.submission.kafka;

import com.campusiq.submission.dto.EvaluationResult;
import com.campusiq.submission.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationResultConsumer {

    private final SubmissionService submissionService;

    @KafkaListener(topics = "evaluation.completed", groupId = "submission-service")
    public void consumeEvaluationResult(EvaluationResult result) {
        log.info("Received evaluation result for submissionId: {}, score: {}", result.getSubmissionId(), result.getScore());
        try {
            submissionService.updateSubmissionResult(result.getSubmissionId(), result.getScore());
            log.info("Successfully updated submission {} with score {}", result.getSubmissionId(), result.getScore());
        } catch (Exception e) {
            log.error("Failed to process evaluation result for submissionId: {}", result.getSubmissionId(), e);
        }
    }
}
