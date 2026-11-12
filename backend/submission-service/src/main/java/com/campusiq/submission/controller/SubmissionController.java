package com.campusiq.submission.controller;

import com.campusiq.submission.dto.SubmissionRequest;
import com.campusiq.submission.dto.SubmissionResponse;
import com.campusiq.submission.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionResponse> submit(
            @Valid @RequestBody SubmissionRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        SubmissionResponse response = submissionService.submit(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubmissionResponse>> getUserSubmissions(@PathVariable Long userId) {
        return ResponseEntity.ok(submissionService.getUserSubmissions(userId));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<SubmissionResponse>> getContestSubmissions(@PathVariable Long contestId) {
        return ResponseEntity.ok(submissionService.getContestSubmissions(contestId));
    }

    @GetMapping("/contest/{contestId}/user/{userId}")
    public ResponseEntity<List<SubmissionResponse>> getUserContestSubmissions(
            @PathVariable Long contestId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(submissionService.getUserContestSubmissions(contestId, userId));
    }
}
