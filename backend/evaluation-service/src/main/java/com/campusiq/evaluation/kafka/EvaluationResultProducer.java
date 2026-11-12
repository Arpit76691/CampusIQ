package com.campusiq.evaluation.kafka;

import com.campusiq.evaluation.dto.EvaluationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EvaluationResultProducer {

    private final KafkaTemplate<String, EvaluationResult> kafkaTemplate;

    public void sendEvaluationResult(EvaluationResult result) {
        log.info("Publishing evaluation result for submissionId={} score={}", result.getSubmissionId(), result.getScore());
        kafkaTemplate.send("evaluation.completed", String.valueOf(result.getSubmissionId()), result);
    }
}
