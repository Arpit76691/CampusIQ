package com.campusiq.evaluation.service;

import com.campusiq.evaluation.dto.EvaluationResult;
import com.campusiq.evaluation.dto.SubmissionEvent;
import com.campusiq.evaluation.kafka.EvaluationResultProducer;
import com.campusiq.evaluation.model.EvaluationRecord;
import com.campusiq.evaluation.repository.EvaluationRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final EvaluationRecordRepository evaluationRecordRepository;
    private final EvaluationResultProducer evaluationResultProducer;
    private final Random random = new Random();

    public void evaluateSubmission(SubmissionEvent event) {
        log.info("Evaluating submission: {}", event.getSubmissionId());

        int score = calculateScore(event.getAnswer());
        String feedback = generateFeedback(score);

        EvaluationRecord record = EvaluationRecord.builder()
                .submissionId(event.getSubmissionId())
                .userId(event.getUserId())
                .contestId(event.getContestId())
                .problemId(event.getProblemId())
                .score(score)
                .feedback(feedback)
                .evaluatedAt(LocalDateTime.now())
                .build();

        evaluationRecordRepository.save(record);

        EvaluationResult result = EvaluationResult.builder()
                .submissionId(event.getSubmissionId())
                .userId(event.getUserId())
                .contestId(event.getContestId())
                .problemId(event.getProblemId())
                .score(score)
                .feedback(feedback)
                .evaluatedAt(LocalDateTime.now())
                .build();

        evaluationResultProducer.sendEvaluationResult(result);
        log.info("Evaluation complete for submission {}. Score: {}", event.getSubmissionId(), score);
    }

    private int calculateScore(String answer) {
        if (answer == null || answer.isBlank()) {
            return 0;
        }
        // Mock evaluation: base 50 + bonus for answer length (up to 50 extra)
        int lengthBonus = Math.min(50, answer.trim().length() / 5);
        int baseScore = 50 + lengthBonus;
        // Add slight randomness ±10
        int variance = random.nextInt(21) - 10;
        return Math.max(0, Math.min(100, baseScore + variance));
    }

    private String generateFeedback(int score) {
        if (score >= 90) return "Excellent work! Near-perfect answer.";
        if (score >= 75) return "Good attempt! Minor improvements needed.";
        if (score >= 60) return "Satisfactory. Review the core concepts.";
        if (score >= 40) return "Partial credit. Significant gaps detected.";
        return "Needs improvement. Please review the topic thoroughly.";
    }

    public List<EvaluationRecord> getBySubmissionId(Long submissionId) {
        return evaluationRecordRepository.findBySubmissionId(submissionId)
                .map(List::of)
                .orElse(List.of());
    }

    public List<EvaluationRecord> getByUserId(Long userId) {
        return evaluationRecordRepository.findByUserId(userId);
    }

    public List<EvaluationRecord> getByContestId(Long contestId) {
        return evaluationRecordRepository.findByContestId(contestId);
    }
}
