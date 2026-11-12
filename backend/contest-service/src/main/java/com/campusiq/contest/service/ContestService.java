package com.campusiq.contest.service;

import com.campusiq.contest.dto.ContestEvent;
import com.campusiq.contest.dto.ContestRequest;
import com.campusiq.contest.dto.ContestResponse;
import com.campusiq.contest.dto.ProblemRequest;
import com.campusiq.contest.exception.ContestNotFoundException;
import com.campusiq.contest.kafka.ContestEventProducer;
import com.campusiq.contest.model.Contest;
import com.campusiq.contest.model.ContestStatus;
import com.campusiq.contest.model.Problem;
import com.campusiq.contest.repository.ContestRepository;
import com.campusiq.contest.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContestService {

    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final ContestEventProducer contestEventProducer;

    @Transactional
    public ContestResponse createContest(ContestRequest request, Long createdBy) {
        Contest contest = Contest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .subject(request.getSubject())
                .difficulty(request.getDifficulty())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxParticipants(request.getMaxParticipants())
                .createdBy(createdBy)
                .status(ContestStatus.UPCOMING)
                .build();
        Contest saved = contestRepository.save(contest);
        return toResponse(saved);
    }

    public ContestResponse getContestById(Long id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ContestNotFoundException(id));
        return toResponse(contest);
    }

    public List<ContestResponse> getAllContests(ContestStatus status) {
        List<Contest> contests;
        if (status != null) {
            contests = contestRepository.findByStatus(status);
        } else {
            contests = contestRepository.findAll();
        }
        return contests.stream().map(this::toResponse).toList();
    }

    @Transactional
    public ContestResponse updateContest(Long id, ContestRequest request) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ContestNotFoundException(id));
        contest.setTitle(request.getTitle());
        contest.setDescription(request.getDescription());
        contest.setSubject(request.getSubject());
        contest.setDifficulty(request.getDifficulty());
        contest.setStartTime(request.getStartTime());
        contest.setEndTime(request.getEndTime());
        contest.setMaxParticipants(request.getMaxParticipants());
        Contest saved = contestRepository.save(contest);
        return toResponse(saved);
    }

    @Transactional
    public void deleteContest(Long id) {
        if (!contestRepository.existsById(id)) {
            throw new ContestNotFoundException(id);
        }
        contestRepository.deleteById(id);
    }

    @Transactional
    public Problem addProblem(Long contestId, ProblemRequest request) {
        if (!contestRepository.existsById(contestId)) {
            throw new ContestNotFoundException(contestId);
        }
        Problem problem = Problem.builder()
                .contestId(contestId)
                .title(request.getTitle())
                .description(request.getDescription())
                .points(request.getPoints())
                .type(request.getType())
                .options(request.getOptions())
                .correctAnswer(request.getCorrectAnswer())
                .build();
        return problemRepository.save(problem);
    }

    public List<Problem> getProblems(Long contestId) {
        if (!contestRepository.existsById(contestId)) {
            throw new ContestNotFoundException(contestId);
        }
        return problemRepository.findByContestId(contestId);
    }

    @Transactional
    public void updateContestStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Transition UPCOMING → LIVE
        List<Contest> toStart = contestRepository.findByStartTimeBeforeAndStatus(now, ContestStatus.UPCOMING);
        for (Contest contest : toStart) {
            contest.setStatus(ContestStatus.LIVE);
            contestRepository.save(contest);
            log.info("Contest {} transitioned to LIVE", contest.getId());

            ContestEvent event = ContestEvent.builder()
                    .contestId(contest.getId())
                    .title(contest.getTitle())
                    .subject(contest.getSubject())
                    .eventType("STARTED")
                    .timestamp(now)
                    .build();
            try {
                contestEventProducer.sendContestStarted(event);
            } catch (Exception e) {
                log.error("Failed to publish contest.started event for contestId={}: {}", contest.getId(), e.getMessage());
            }
        }

        // Transition LIVE → ENDED
        List<Contest> liveContests = contestRepository.findByStatus(ContestStatus.LIVE);
        for (Contest contest : liveContests) {
            if (contest.getEndTime().isBefore(now)) {
                contest.setStatus(ContestStatus.ENDED);
                contestRepository.save(contest);
                log.info("Contest {} transitioned to ENDED", contest.getId());

                ContestEvent event = ContestEvent.builder()
                        .contestId(contest.getId())
                        .title(contest.getTitle())
                        .subject(contest.getSubject())
                        .eventType("ENDED")
                        .timestamp(now)
                        .build();
                try {
                    contestEventProducer.sendContestEnded(event);
                } catch (Exception e) {
                    log.error("Failed to publish contest.ended event for contestId={}: {}", contest.getId(), e.getMessage());
                }
            }
        }
    }

    private ContestResponse toResponse(Contest contest) {
        long problemCount = problemRepository.countByContestId(contest.getId());
        return ContestResponse.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .description(contest.getDescription())
                .subject(contest.getSubject())
                .difficulty(contest.getDifficulty())
                .startTime(contest.getStartTime())
                .endTime(contest.getEndTime())
                .status(contest.getStatus())
                .createdBy(contest.getCreatedBy())
                .maxParticipants(contest.getMaxParticipants())
                .createdAt(contest.getCreatedAt())
                .updatedAt(contest.getUpdatedAt())
                .problemCount(problemCount)
                .build();
    }
}
