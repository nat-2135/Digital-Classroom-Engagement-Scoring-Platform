package com.platform.services;

import com.platform.dto.LeaderboardDTO;
import com.platform.models.Role;
import com.platform.models.User;
import com.platform.models.EngagementRecord;
import com.platform.repository.UserRepository;
import com.platform.repository.EngagementRecordRepository;
import com.platform.repository.StudentBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EngagementRecordRepository engagementRecordRepository;

    @Autowired
    private StudentBadgeRepository studentBadgeRepository;

    @Autowired
    private com.platform.repository.TestSubmissionRepository testSubmissionRepository;

    public List<LeaderboardDTO> getClassLeaderboard(Long currentStudentId, Integer week) {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<LeaderboardDTO> board = new ArrayList<>();

        for (User student : students) {
            List<EngagementRecord> records = engagementRecordRepository.findByStudentIdOrderByWeekDesc(student.getId());

            double score = 0.0;
            double attendance = 0.0;
            double participation = 0.0;
            double assignment = 0.0;
            double testScore = 0.0;

            if (week != null && week > 0) {
                java.util.Optional<EngagementRecord> specific = engagementRecordRepository.findByStudentIdAndWeek(student.getId(), week);
                if (specific.isPresent()) {
                    EngagementRecord latest = specific.get();
                    score = latest.getEngagementScore() != null ? latest.getEngagementScore() : 0.0;
                    attendance = latest.getAttendance() != null ? latest.getAttendance() : 0.0;
                    participation = latest.getParticipation() != null ? latest.getParticipation().doubleValue() : 0.0;
                    
                    if ("ON_TIME".equalsIgnoreCase(latest.getAssignmentStatus())) assignment = 100.0;
                    else if ("LATE".equalsIgnoreCase(latest.getAssignmentStatus())) assignment = 50.0;
                }
                
                // Pull test score for this specific week directly
                java.util.List<com.platform.models.TestSubmission> subs = testSubmissionRepository.findByTestWeekNumberAndStudentId(week, student.getId());
                if (!subs.isEmpty()) {
                    com.platform.models.TestSubmission latestSub = subs.get(subs.size() - 1);
                    if (latestSub.getTotalMarks() != null && latestSub.getTotalMarks() > 0) {
                        testScore = (double) latestSub.getScore() / latestSub.getTotalMarks() * 100.0;
                        if (Double.isNaN(testScore) || Double.isInfinite(testScore)) testScore = 0.0;
                    }
                }
            } else if (!records.isEmpty()) {
                // Latest logic (same as before)
                EngagementRecord latest = records.get(0);
                score = latest.getEngagementScore() != null ? latest.getEngagementScore() : 0.0;
                attendance = latest.getAttendance() != null ? latest.getAttendance() : 0.0;
                participation = latest.getParticipation() != null ? latest.getParticipation().doubleValue() : 0.0;
                
                if ("ON_TIME".equalsIgnoreCase(latest.getAssignmentStatus())) assignment = 100.0;
                else if ("LATE".equalsIgnoreCase(latest.getAssignmentStatus())) assignment = 50.0;

                if (latest.getTestScore() != null && latest.getTestTotalMarks() != null && latest.getTestTotalMarks() > 0) {
                    testScore = (double) latest.getTestScore() / latest.getTestTotalMarks() * 100.0;
                    if (Double.isNaN(testScore) || Double.isInfinite(testScore)) testScore = 0.0;
                }
            }

            int badgeCount = (int) studentBadgeRepository.countByStudentId(student.getId());

            boolean showName = student.isShowLeaderboardName();
            boolean isCurrent = student.getId().equals(currentStudentId);

            LeaderboardDTO dto = LeaderboardDTO.builder()
                .studentId(student.getId())
                .displayName(showName || isCurrent ? student.getName() : "Anonymous Student")
                .engagementScore(score)
                .attendanceAvg(attendance)
                .participationAvg(participation)
                .assignmentAvg(assignment)
                .testScoreAvg(testScore)
                .isCurrentUser(isCurrent)
                .isAnonymous(!showName && !isCurrent)
                .badgeCount(badgeCount)
                .rank(0)
                .build();

            board.add(dto);
        }

        board.sort((a, b) -> Double.compare(b.getEngagementScore(), a.getEngagementScore()));

        for (int i = 0; i < board.size(); i++) {
            board.get(i).setRank(i + 1);
        }

        return board;
    }

    public void updatePrivacy(Long studentId, boolean showName) {
        User user = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setShowLeaderboardName(showName);
        userRepository.save(user);
    }
}
