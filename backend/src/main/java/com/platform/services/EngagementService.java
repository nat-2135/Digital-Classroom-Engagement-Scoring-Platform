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

        double score = (attendance * 0.5) + ((participation / 5.0) * 100 * 0.3) + assignmentValue;

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
}
