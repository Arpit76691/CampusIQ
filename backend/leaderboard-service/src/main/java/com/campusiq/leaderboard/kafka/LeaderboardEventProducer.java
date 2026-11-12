package com.campusiq.leaderboard.kafka;

import com.campusiq.leaderboard.dto.LeaderboardUpdate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LeaderboardEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "leaderboard.updated";

    /**
     * Publish a leaderboard update event to Kafka.
     */
    public void sendLeaderboardUpdate(LeaderboardUpdate update) {
        kafkaTemplate.send(TOPIC, update.getContestId().toString(), update);
        log.info("Published leaderboard update for contestId={}", update.getContestId());
    }
}
