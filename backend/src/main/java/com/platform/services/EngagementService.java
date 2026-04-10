package com.platform.services;

import com.platform.models.EngagementRecord;
import com.platform.models.User;
import com.platform.repository.EngagementRecordRepository;
import com.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class EngagementService {
    @Autowired
    private EngagementRecordRepository engagementRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BadgeService badgeService;

    @Autowired
    private com.platform.repository.TestSubmissionRepository testSubmissionRepository;

    public EngagementRecord saveEngagement(@NonNull Long studentId, @NonNull Integer week, Double attendance, Integer participation,
            String assignmentStatus, Integer testScore, Integer testTotalMarks) {
        User student = userRepository.findById(studentId).orElseThrow();

        // Upsert logic: find existing by student + week
        java.util.Optional<EngagementRecord> existing = engagementRecordRepository.findByStudentIdAndWeek(studentId, week);
        
        double assignmentValue = 0;
        if ("ON_TIME".equalsIgnoreCase(assignmentStatus))
            assignmentValue = 20;
        else if ("LATE".equalsIgnoreCase(assignmentStatus))
            assignmentValue = 10;

        // Enhanced score: Attendance (30%) + Participation (20%) + Assignment (20%) + Test (30%)
        // Attendance (0.3 of 100) = 30 max
        // Participation (0.2 of 100) = 20 max (if p=5)
        // Assignment is already coded as max 20
        // Test: scale to 30.
        
        double testValue = 0;
        if (testTotalMarks != null && testTotalMarks > 0 && testScore != null) {
            testValue = (testScore * 1.0 / testTotalMarks) * 30.0;
        }

        double score = (attendance * 0.3) + ((participation / 5.0) * 100 * 0.2) + assignmentValue + testValue;

        EngagementRecord record = existing.orElse(new EngagementRecord());
        record.setStudent(student);
        record.setWeek(week);
        record.setAttendance(attendance);
        record.setParticipation(participation);
        record.setAssignmentStatus(assignmentStatus);
        record.setEngagementScore(score);
        record.setTestScore(testScore != null ? testScore : 0);
        record.setTestTotalMarks(testTotalMarks != null ? testTotalMarks : 0);
        record.setCreatedAt(java.time.LocalDateTime.now());

        EngagementRecord saved = engagementRecordRepository.save(record);
        badgeService.checkAndAwardBadges(studentId);
        return saved;
    }

    public List<EngagementRecord> getStudentHistory(@NonNull Long studentId) {
        return engagementRecordRepository.findByStudentIdOrderByWeekAsc(studentId);
    }

    public List<EngagementRecord> getAllEngagement(Integer week) {
        if (week != null)
            return engagementRecordRepository.findByWeek(week);
        return engagementRecordRepository.findAll();
    }

    public List<EngagementRecord> getAllHistory() {
        return engagementRecordRepository.findAll();
    }

    public EngagementRecord updateEngagementFromTest(User student, Integer week) {
        // Find existing or use defaults
        EngagementRecord existing = engagementRecordRepository.findByStudentIdAndWeek(student.getId(), week)
            .orElse(EngagementRecord.builder()
                .student(student)
                .week(week)
                .attendance(100.0) // Assume 100% if not yet marked by teacher
                .participation(5)   // Assume 5/5 if not yet marked by teacher
                .assignmentStatus("ON_TIME")
                .testScore(0)
                .testTotalMarks(100)
                .build());
        
        return saveEngagement(student.getId(), week, existing.getAttendance(), existing.getParticipation(), existing.getAssignmentStatus(), existing.getTestScore(), existing.getTestTotalMarks());
    }
}
