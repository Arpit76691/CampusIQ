package com.campusiq.leaderboard.kafka;

import com.campusiq.leaderboard.dto.EvaluationResult;
import com.campusiq.leaderboard.dto.LeaderboardEntry;
import com.campusiq.leaderboard.dto.LeaderboardUpdate;
import com.campusiq.leaderboard.service.LeaderboardService;
import com.campusiq.leaderboard.websocket.LeaderboardWebSocketController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EvaluationResultConsumer {

    private final LeaderboardService leaderboardService;
    private final LeaderboardWebSocketController webSocketController;
    private final LeaderboardEventProducer leaderboardEventProducer;

    @KafkaListener(topics = "evaluation.completed", groupId = "leaderboard-service")
    public void consumeEvaluationResult(EvaluationResult result) {
        log.info("Received evaluation result: submissionId={}, userId={}, contestId={}, score={}",
                result.getSubmissionId(), result.getUserId(), result.getContestId(), result.getScore());

        // Update the score in Redis
        leaderboardService.updateScore(
                result.getContestId(),
                result.getUserId(),
                "user-" + result.getUserId(), // default username; enriched upstream if available
                result.getScore()
        );

        // Get the updated top 10 leaderboard
        List<LeaderboardEntry> top10 = leaderboardService.getLeaderboard(result.getContestId(), 10);

        LeaderboardUpdate update = LeaderboardUpdate.builder()
                .contestId(result.getContestId())
                .entries(top10)
                .updatedAt(LocalDateTime.now())
                .build();

        // Broadcast via WebSocket
        webSocketController.broadcastLeaderboardUpdate(result.getContestId(), update);

        // Publish to Kafka
        leaderboardEventProducer.sendLeaderboardUpdate(update);
    }
}
