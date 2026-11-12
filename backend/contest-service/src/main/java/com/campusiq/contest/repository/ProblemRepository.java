package com.campusiq.contest.repository;

import com.campusiq.contest.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByContestId(Long contestId);

    long countByContestId(Long contestId);
}
