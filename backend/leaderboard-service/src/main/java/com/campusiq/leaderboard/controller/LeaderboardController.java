package com.campusiq.leaderboard.controller;

import com.campusiq.leaderboard.dto.LeaderboardEntry;
import com.campusiq.leaderboard.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    /**
     * Health / index endpoint – returns an empty list when no contestId is provided.
     * Prevents 500 from NoResourceFoundException on GET /api/leaderboard.
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "10") int top) {
        // No single global leaderboard; return empty list as placeholder.
        return ResponseEntity.ok(List.of());
    }

    /**
     * Get the top N entries from the contest leaderboard.
     * Defaults to top 10 if no query param is provided.
     */
    @GetMapping("/{contestId}")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(
            @PathVariable Long contestId,
            @RequestParam(defaultValue = "10") int top) {
        List<LeaderboardEntry> entries = leaderboardService.getLeaderboard(contestId, top);
        return ResponseEntity.ok(entries);
    }

    /**
     * Get a specific user's rank in the contest leaderboard.
     */
    @GetMapping("/{contestId}/rank/{userId}")
    public ResponseEntity<?> getUserRank(
            @PathVariable Long contestId,
            @PathVariable Long userId) {
        Long rank = leaderboardService.getUserRank(contestId, userId);
        if (rank == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("contestId", contestId, "userId", userId, "rank", rank));
    }

    /**
     * Get a specific user's score in the contest leaderboard.
     */
    @GetMapping("/{contestId}/score/{userId}")
    public ResponseEntity<?> getUserScore(
            @PathVariable Long contestId,
            @PathVariable Long userId) {
        Double score = leaderboardService.getUserScore(contestId, userId);
        if (score == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("contestId", contestId, "userId", userId, "score", score));
    }
}
