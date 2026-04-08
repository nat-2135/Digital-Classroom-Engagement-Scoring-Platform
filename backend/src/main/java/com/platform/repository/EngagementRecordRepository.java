package com.platform.repository;

import com.platform.models.EngagementRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EngagementRecordRepository extends JpaRepository<EngagementRecord, Long> {
    List<EngagementRecord> findByStudentIdOrderByWeekAsc(Long studentId);
    
    List<EngagementRecord> findByStudentIdOrderByWeekDesc(Long studentId);

    List<EngagementRecord> findByWeek(Integer week);

    Optional<EngagementRecord> findByStudentIdAndWeek(Long studentId, Integer week);
}