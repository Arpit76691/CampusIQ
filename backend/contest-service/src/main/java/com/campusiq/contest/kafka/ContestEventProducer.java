package com.campusiq.contest.kafka;

import com.campusiq.contest.dto.ContestEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContestEventProducer {

    private final KafkaTemplate<String, ContestEvent> kafkaTemplate;

    public void sendContestStarted(ContestEvent event) {
        log.info("Publishing contest.started event for contestId={}", event.getContestId());
        kafkaTemplate.send("contest.started", String.valueOf(event.getContestId()), event);
    }

    public void sendContestEnded(ContestEvent event) {
        log.info("Publishing contest.ended event for contestId={}", event.getContestId());
        kafkaTemplate.send("contest.ended", String.valueOf(event.getContestId()), event);
    }
}
