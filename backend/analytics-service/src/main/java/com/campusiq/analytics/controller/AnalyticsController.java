package com.campusiq.analytics.controller;

import com.campusiq.analytics.dto.DashboardStats;
import com.campusiq.analytics.model.ContestAnalytics;
import com.campusiq.analytics.model.StudentAnalytics;
import com.campusiq.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<?> getContestAnalytics(@PathVariable Long contestId) {
        return analyticsService.getContestAnalytics(contestId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<?> getStudentAnalytics(@PathVariable Long userId) {
        return analyticsService.getStudentAnalytics(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/top-contests")
    public ResponseEntity<List<ContestAnalytics>> getTopContests() {
        return ResponseEntity.ok(analyticsService.getTopContests());
    }

    @GetMapping("/top-students")
    public ResponseEntity<List<StudentAnalytics>> getTopStudents() {
        return ResponseEntity.ok(analyticsService.getTopStudents());
    }
}
