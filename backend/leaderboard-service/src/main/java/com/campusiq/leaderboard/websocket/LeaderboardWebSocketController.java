package com.campusiq.leaderboard.websocket;

import com.campusiq.leaderboard.dto.LeaderboardUpdate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class LeaderboardWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast a leaderboard update to all subscribers of the contest topic.
     */
    public void broadcastLeaderboardUpdate(Long contestId, LeaderboardUpdate update) {
        String destination = "/topic/leaderboard/" + contestId;
        messagingTemplate.convertAndSend(destination, update);
        log.info("Broadcasted leaderboard update to {} with {} entries",
                destination, update.getEntries().size());
    }
}
