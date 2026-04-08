package com.platform.repository;

import com.platform.models.WeeklyTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WeeklyTestRepository extends JpaRepository<WeeklyTest, Long> {
    List<WeeklyTest> findByTeacherId(Long teacherId);

    List<WeeklyTest> findByWeekNumber(Integer weekNumber);
}
