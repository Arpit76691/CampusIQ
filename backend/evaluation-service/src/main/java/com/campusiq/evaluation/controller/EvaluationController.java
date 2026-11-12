package com.campusiq.evaluation.controller;

import com.campusiq.evaluation.model.EvaluationRecord;
import com.campusiq.evaluation.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<EvaluationRecord>> getBySubmission(@PathVariable Long submissionId) {
        return ResponseEntity.ok(evaluationService.getBySubmissionId(submissionId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EvaluationRecord>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(evaluationService.getByUserId(userId));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<EvaluationRecord>> getByContest(@PathVariable Long contestId) {
        return ResponseEntity.ok(evaluationService.getByContestId(contestId));
    }
}
