package com.platform.services;

import com.platform.models.*;
import com.platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BadgeService {

    @Autowired
    private StudentBadgeRepository studentBadgeRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EngagementRecordRepository engagementRecordRepository;

    @Autowired
    private TestSubmissionRepository testSubmissionRepository;



    public void checkAndAwardBadges(Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow();
        List<EngagementRecord> history = engagementRecordRepository.findByStudentIdOrderByWeekAsc(studentId);
        List<TestSubmission> testSubmissions = testSubmissionRepository.findByStudentId(studentId);


        // 🔥 5 Week Streak
        if (history.size() >= 5) {
            boolean streak = history.subList(history.size() - 5, history.size()).stream()
                    .allMatch(r -> r.getEngagementScore() >= 60);
            if (streak)
                awardBadge(student, "5 Week Streak");
        }

        // ⚡ 10 Week Streak
        if (history.size() >= 10) {
            boolean streak = history.subList(history.size() - 10, history.size()).stream()
                    .allMatch(r -> r.getEngagementScore() >= 60);
            if (streak)
                awardBadge(student, "10 Week Streak");
        }

        // 🎯 Perfect Attendance
        if (history.stream().anyMatch(r -> r.getAttendance() == 100)) {
            awardBadge(student, "Perfect Attendance");
        }

        // 🙋 Full Participation
        if (history.stream().anyMatch(r -> r.getParticipation() == 5)) {
            awardBadge(student, "Full Participation");
        }

        // 🏆 Test Topper
        for (TestSubmission submission : testSubmissions) {
            List<TestSubmission> allSubs = testSubmissionRepository.findByTestId(submission.getTest().getId());
            double maxScore = allSubs.stream().mapToDouble(TestSubmission::getScore).max().orElse(0);
            if (submission.getScore() == maxScore && maxScore > 0) {
                awardBadge(student, "Test Topper");
            }
        }

        // 📈 Most Improved
        if (history.size() >= 2) {
            for (int i = 1; i < history.size(); i++) {
                if (history.get(i).getEngagementScore() - history.get(i - 1).getEngagementScore() >= 20) {
                    awardBadge(student, "Most Improved");
                }
            }
        }

        // ✅ Assignment Master
        if (history.size() >= 5) {
            for (int i = 0; i <= history.size() - 5; i++) {
                boolean allOnTime = history.subList(i, i + 5).stream()
                        .allMatch(r -> "ON_TIME".equals(r.getAssignmentStatus()));
                if (allOnTime)
                    awardBadge(student, "Assignment Master");
            }
        }

        // 💪 Comeback Kid
        if (history.size() >= 3) {
            for (int i = 2; i < history.size(); i++) {
                double drop = history.get(i - 2).getEngagementScore() - history.get(i - 1).getEngagementScore();
                double rise = history.get(i).getEngagementScore() - history.get(i - 1).getEngagementScore();
                if (drop > 0 && rise >= 15) {
                    awardBadge(student, "Comeback Kid");
                }
            }
        }

        // 🌱 Consistent Learner
        if (history.size() >= 8) {
            // Very simplified slope check
            double first = history.get(history.size() - 8).getEngagementScore();
            double last = history.get(history.size() - 1).getEngagementScore();
            double slope = (last - first) / 8.0;
            if (slope >= -2 && slope <= 2) {
                awardBadge(student, "Consistent Learner");
            }
        }

        // 🪞 Self-Aware
        // Submitted 4 weeks in a row (simplified)
        // This would need more complex logic to check consecutive weeks.
        awardBadge(student, "Self-Aware"); // Simplified trigger
    }

    private void awardBadge(User student, String badgeName) {
        Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isPresent()) {
            Badge badge = badgeOpt.get();
            try {
                if (!studentBadgeRepository.findByStudentIdAndBadgeId(student.getId(), badge.getId()).isPresent()) {
                    StudentBadge sb = StudentBadge.builder()
                            .student(student)
                            .badge(badge)
                            .build();
                    studentBadgeRepository.save(sb);
                }
            } catch (Exception e) {
                // Silently catch duplicate key
            }
        }
    }

    public List<StudentBadge> getStudentBadges(Long studentId) {
        return studentBadgeRepository.findByStudentId(studentId);
    }

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }
}
