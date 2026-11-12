package com.campusiq.contest.scheduler;

import com.campusiq.contest.service.ContestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContestStatusScheduler {

    private final ContestService contestService;

    @Scheduled(fixedRate = 30000)
    public void updateContestStatuses() {
        log.debug("Running scheduled contest status update...");
        contestService.updateContestStatuses();
    }
}
