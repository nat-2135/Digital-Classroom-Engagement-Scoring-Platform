package com.platform.repository;

import com.platform.models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f WHERE f.student.id = :studentId ORDER BY f.createdAt DESC")
    List<Feedback> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);
}
