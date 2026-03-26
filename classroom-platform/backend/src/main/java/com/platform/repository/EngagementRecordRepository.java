package com.platform.repository;

import com.platform.models.EngagementRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EngagementRecordRepository extends JpaRepository<EngagementRecord, Long> {
    List<EngagementRecord> findByStudentIdOrderByWeekAsc(Long studentId);
    
    List<EngagementRecord> findByStudentIdOrderByWeekDesc(Long studentId);

    List<EngagementRecord> findByWeek(Integer week);

    java.util.Optional<EngagementRecord> findByStudentIdAndWeek(Long studentId, Integer week);
}
