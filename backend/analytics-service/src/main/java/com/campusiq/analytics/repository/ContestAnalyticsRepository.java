package com.campusiq.analytics.repository;

import com.campusiq.analytics.model.ContestAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContestAnalyticsRepository extends JpaRepository<ContestAnalytics, Long> {

    Optional<ContestAnalytics> findByContestId(Long contestId);

    List<ContestAnalytics> findTop10ByOrderByAverageScoreDesc();
}
