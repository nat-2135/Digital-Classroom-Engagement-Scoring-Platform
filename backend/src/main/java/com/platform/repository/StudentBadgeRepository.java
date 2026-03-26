package com.platform.repository;

import com.platform.models.StudentBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentBadgeRepository extends JpaRepository<StudentBadge, Long> {
    List<StudentBadge> findByStudentId(Long studentId);
    
    long countByStudentId(Long studentId);

    Optional<StudentBadge> findByStudentIdAndBadgeId(Long studentId, Long badgeId);
}
