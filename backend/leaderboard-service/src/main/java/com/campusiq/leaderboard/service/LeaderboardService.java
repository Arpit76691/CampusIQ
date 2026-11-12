package com.campusiq.leaderboard.service;

import com.campusiq.leaderboard.dto.LeaderboardEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String LEADERBOARD_KEY_PREFIX = "leaderboard:contest:";
    private static final String NAMES_KEY_PREFIX = "leaderboard:names:";

    /**
     * Update (increment) a user's score on the contest leaderboard.
     * Also stores the username mapping in a Redis hash.
     */
    public void updateScore(Long contestId, Long userId, String username, double score) {
        String leaderboardKey = LEADERBOARD_KEY_PREFIX + contestId;
        String namesKey = NAMES_KEY_PREFIX + contestId;

        redisTemplate.opsForZSet().incrementScore(leaderboardKey, userId.toString(), score);
        redisTemplate.opsForHash().put(namesKey, userId.toString(), username);

        log.info("Updated score for userId={} in contestId={}: +{}", userId, contestId, score);
    }

    /**
     * Get the top N entries from the contest leaderboard, ordered by score descending.
     */
    public List<LeaderboardEntry> getLeaderboard(Long contestId, int top) {
        String leaderboardKey = LEADERBOARD_KEY_PREFIX + contestId;
        String namesKey = NAMES_KEY_PREFIX + contestId;

        Set<ZSetOperations.TypedTuple<String>> tuples =
                redisTemplate.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, top - 1);

        List<LeaderboardEntry> entries = new ArrayList<>();

        if (tuples == null || tuples.isEmpty()) {
            return entries;
        }

        int rank = 1;
        for (ZSetOperations.TypedTuple<String> tuple : tuples) {
            String userIdStr = tuple.getValue();
            Double score = tuple.getScore();

            Object usernameObj = redisTemplate.opsForHash().get(namesKey, userIdStr);
            String username = usernameObj != null ? usernameObj.toString() : "Unknown";

            entries.add(LeaderboardEntry.builder()
                    .userId(Long.parseLong(userIdStr))
                    .username(username)
                    .score(score)
                    .rank(rank++)
                    .build());
        }

        return entries;
    }

    /**
     * Get a user's rank in the contest leaderboard (0-based from Redis, returned as 1-based).
     * Returns null if the user is not on the leaderboard.
     */
    public Long getUserRank(Long contestId, Long userId) {
        String leaderboardKey = LEADERBOARD_KEY_PREFIX + contestId;
        Long rank = redisTemplate.opsForZSet().reverseRank(leaderboardKey, userId.toString());
        return rank != null ? rank + 1 : null;
    }

    /**
     * Get a user's score in the contest leaderboard.
     * Returns null if the user is not on the leaderboard.
     */
    public Double getUserScore(Long contestId, Long userId) {
        String leaderboardKey = LEADERBOARD_KEY_PREFIX + contestId;
        return redisTemplate.opsForZSet().score(leaderboardKey, userId.toString());
    }

    /**
     * Clear the leaderboard and associated name mappings for a contest.
     */
    public void clearLeaderboard(Long contestId) {
        String leaderboardKey = LEADERBOARD_KEY_PREFIX + contestId;
        String namesKey = NAMES_KEY_PREFIX + contestId;

        redisTemplate.delete(leaderboardKey);
        redisTemplate.delete(namesKey);

        log.info("Cleared leaderboard for contestId={}", contestId);
    }
}
