package com.platform.repository;

import com.platform.models.SelfAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SelfAssessmentRepository extends JpaRepository<SelfAssessment, Long> {
    Optional<SelfAssessment> findByStudentIdAndWeek(Long studentId, Integer week);

    List<SelfAssessment> findByWeek(Integer week);
}
