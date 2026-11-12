package com.campusiq.submission.service;

import com.campusiq.submission.dto.SubmissionEvent;
import com.campusiq.submission.dto.SubmissionRequest;
import com.campusiq.submission.dto.SubmissionResponse;
import com.campusiq.submission.exception.SubmissionNotFoundException;
import com.campusiq.submission.kafka.SubmissionEventProducer;
import com.campusiq.submission.model.Submission;
import com.campusiq.submission.model.SubmissionStatus;
import com.campusiq.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionEventProducer submissionEventProducer;

    @Transactional
    public SubmissionResponse submit(SubmissionRequest request, Long userId) {
        Submission submission = Submission.builder()
                .userId(userId)
                .contestId(request.getContestId())
                .problemId(request.getProblemId())
                .answer(request.getAnswer())
                .language(request.getLanguage())
                .status(SubmissionStatus.PENDING)
                .build();

        Submission saved = submissionRepository.save(submission);
        log.info("Submission created with id: {} for userId: {}", saved.getId(), userId);

        SubmissionEvent event = SubmissionEvent.builder()
                .submissionId(saved.getId())
                .userId(saved.getUserId())
                .contestId(saved.getContestId())
                .problemId(saved.getProblemId())
                .answer(saved.getAnswer())
                .language(saved.getLanguage())
                .build();

        submissionEventProducer.sendSubmissionCreated(event);

        return mapToResponse(saved);
    }

    public SubmissionResponse getSubmission(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new SubmissionNotFoundException(id));
        return mapToResponse(submission);
    }

    public List<SubmissionResponse> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SubmissionResponse> getContestSubmissions(Long contestId) {
        return submissionRepository.findByContestId(contestId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SubmissionResponse> getUserContestSubmissions(Long contestId, Long userId) {
        return submissionRepository.findByContestIdAndUserId(contestId, userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void updateSubmissionResult(Long submissionId, Integer score) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new SubmissionNotFoundException(submissionId));

        submission.setStatus(SubmissionStatus.EVALUATED);
        submission.setScore(score);
        submission.setEvaluatedAt(LocalDateTime.now());

        submissionRepository.save(submission);
        log.info("Submission {} evaluated with score: {}", submissionId, score);
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .userId(submission.getUserId())
                .contestId(submission.getContestId())
                .problemId(submission.getProblemId())
                .answer(submission.getAnswer())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .score(submission.getScore())
                .submittedAt(submission.getSubmittedAt())
                .evaluatedAt(submission.getEvaluatedAt())
                .build();
    }
}
