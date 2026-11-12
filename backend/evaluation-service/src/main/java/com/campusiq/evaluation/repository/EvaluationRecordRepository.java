package com.campusiq.evaluation.repository;

import com.campusiq.evaluation.model.EvaluationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRecordRepository extends JpaRepository<EvaluationRecord, Long> {

    Optional<EvaluationRecord> findBySubmissionId(Long submissionId);

    List<EvaluationRecord> findByUserId(Long userId);

    List<EvaluationRecord> findByContestId(Long contestId);
}
