package com.campusiq.notification.kafka;

import com.campusiq.notification.dto.ContestEvent;
import com.campusiq.notification.dto.LeaderboardUpdate;
import com.campusiq.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "contest.started", groupId = "notification-service")
    public void handleContestStarted(ContestEvent event) {
        log.info("Received contest.started event: {}", event);
        try {
            notificationService.processContestStarted(event);
        } catch (Exception e) {
            log.error("Error processing contest.started event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "contest.ended", groupId = "notification-service")
    public void handleContestEnded(ContestEvent event) {
        log.info("Received contest.ended event: {}", event);
        try {
            notificationService.processContestEnded(event);
        } catch (Exception e) {
            log.error("Error processing contest.ended event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "leaderboard.updated", groupId = "notification-service")
    public void handleLeaderboardUpdated(LeaderboardUpdate update) {
        log.info("Received leaderboard.updated event: {}", update);
        try {
            notificationService.processLeaderboardUpdate(update);
        } catch (Exception e) {
            log.error("Error processing leaderboard.updated event: {}", e.getMessage(), e);
        }
    }
}
