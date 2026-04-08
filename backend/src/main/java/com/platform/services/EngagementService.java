package com.platform.services;

import com.platform.models.EngagementRecord;
import com.platform.models.User;
import com.platform.repository.EngagementRecordRepository;
import com.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EngagementService {
    @Autowired
    private EngagementRecordRepository engagementRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BadgeService badgeService;

    @Autowired
    private com.platform.repository.TestSubmissionRepository testSubmissionRepository;

    public EngagementRecord saveEngagement(Long studentId, Integer week, Double attendance, Integer participation,
            String assignmentStatus) {
        User student = userRepository.findById(studentId).orElseThrow();

        // Upsert logic: find existing by student + week
        java.util.Optional<EngagementRecord> existing = engagementRecordRepository.findByStudentIdAndWeek(studentId, week);
        
        java.util.List<com.platform.models.TestSubmission> subs = testSubmissionRepository.findByTestWeekNumberAndStudentId(week, studentId);
        com.platform.models.TestSubmission latestSub = subs.isEmpty() ? null : subs.get(subs.size() - 1);

        double assignmentValue = 0;
        if ("ON_TIME".equalsIgnoreCase(assignmentStatus))
            assignmentValue = 20;
        else if ("LATE".equalsIgnoreCase(assignmentStatus))
            assignmentValue = 10;

        // Enhanced score: Attendance (30%) + Participation (20%) + Assignment (20%) + Test (30%)
        // Attendance (0.3 of 100) = 30 max
        // Participation (0.2 of 100) = 20 max (if p=5)
        // Assignment is already coded as max 20
        // Test: if totalMarks is 0 or latestSub is null, use 0. Otherwise scale to 30.
        
        double testValue = 0;
        if (latestSub != null && latestSub.getTotalMarks() > 0) {
            testValue = (latestSub.getScore() * 1.0 / latestSub.getTotalMarks()) * 30.0;
        }

        double score = (attendance * 0.3) + ((participation / 5.0) * 100 * 0.2) + assignmentValue + testValue;

        EngagementRecord record = existing.orElse(new EngagementRecord());
        record.setStudent(student);
        record.setWeek(week);
        record.setAttendance(attendance);
        record.setParticipation(participation);
        record.setAssignmentStatus(assignmentStatus);
        record.setEngagementScore(score);
        record.setTestScore(latestSub != null ? latestSub.getScore() : 0);
        record.setTestTotalMarks(latestSub != null ? latestSub.getTotalMarks() : 0);
        record.setCreatedAt(java.time.LocalDateTime.now());

        EngagementRecord saved = engagementRecordRepository.save(record);
        badgeService.checkAndAwardBadges(studentId);
        return saved;
    }

    public List<EngagementRecord> getStudentHistory(Long studentId) {
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
                .build());
        
        return saveEngagement(student.getId(), week, existing.getAttendance(), existing.getParticipation(), existing.getAssignmentStatus());
    }
}
