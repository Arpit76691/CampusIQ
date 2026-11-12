package com.campusiq.submission.repository;

import com.campusiq.submission.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUserId(Long userId);

    List<Submission> findByContestId(Long contestId);

    List<Submission> findByContestIdAndUserId(Long contestId, Long userId);

    List<Submission> findByProblemIdAndUserId(Long problemId, Long userId);
}
