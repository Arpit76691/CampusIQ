package com.campusiq.contest.controller;

import com.campusiq.contest.dto.ContestRequest;
import com.campusiq.contest.dto.ContestResponse;
import com.campusiq.contest.dto.ProblemRequest;
import com.campusiq.contest.model.ContestStatus;
import com.campusiq.contest.model.Problem;
import com.campusiq.contest.service.ContestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;

    @PostMapping
    public ResponseEntity<ContestResponse> createContest(
            @Valid @RequestBody ContestRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String userRole) {

        if (!"FACULTY".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ContestResponse response = contestService.createContest(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ContestResponse>> getAllContests(
            @RequestParam(value = "status", required = false) ContestStatus status) {
        List<ContestResponse> contests = contestService.getAllContests(status);
        return ResponseEntity.ok(contests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContestResponse> getContestById(@PathVariable Long id) {
        ContestResponse response = contestService.getContestById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContestResponse> updateContest(
            @PathVariable Long id,
            @Valid @RequestBody ContestRequest request) {
        ContestResponse response = contestService.updateContest(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContest(@PathVariable Long id) {
        contestService.deleteContest(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/problems")
    public ResponseEntity<Problem> addProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {
        Problem problem = contestService.addProblem(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(problem);
    }

    @GetMapping("/{id}/problems")
    public ResponseEntity<List<Problem>> getProblems(@PathVariable Long id) {
        List<Problem> problems = contestService.getProblems(id);
        return ResponseEntity.ok(problems);
    }
}
