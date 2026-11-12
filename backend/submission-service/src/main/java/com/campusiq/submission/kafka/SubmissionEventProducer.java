package com.campusiq.submission.kafka;

import com.campusiq.submission.dto.SubmissionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionEventProducer {

    private static final String TOPIC_SUBMISSION_CREATED = "submission.created";

    private final KafkaTemplate<String, SubmissionEvent> kafkaTemplate;

    public void sendSubmissionCreated(SubmissionEvent event) {
        log.info("Publishing submission created event for submissionId: {}", event.getSubmissionId());
        kafkaTemplate.send(TOPIC_SUBMISSION_CREATED, String.valueOf(event.getSubmissionId()), event);
    }
}
