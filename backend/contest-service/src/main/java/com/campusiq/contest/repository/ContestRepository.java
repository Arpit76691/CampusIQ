package com.campusiq.contest.repository;

import com.campusiq.contest.model.Contest;
import com.campusiq.contest.model.ContestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {

    List<Contest> findByStatus(ContestStatus status);

    List<Contest> findByCreatedBy(Long createdBy);

    List<Contest> findByStartTimeBeforeAndStatus(LocalDateTime time, ContestStatus status);
}
