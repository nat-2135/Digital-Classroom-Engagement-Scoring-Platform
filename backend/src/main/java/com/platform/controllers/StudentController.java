package com.platform.controllers;

import com.platform.dto.BadgeDTO;
import com.platform.dto.EngagementDTO;
import com.platform.dto.LeaderboardDTO;
import com.platform.dto.TestSubmissionDTO;
import com.platform.models.EngagementRecord;
import com.platform.models.SelfAssessment;
import com.platform.models.StudentBadge;
import com.platform.models.User;
import com.platform.models.WeeklyTest;
import com.platform.services.AuthService;
import com.platform.services.BadgeService;
import com.platform.services.EngagementService;
import com.platform.services.LeaderboardService;
import com.platform.services.SelfAssessmentService;
import com.platform.services.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//@RestController
//@RequestMapping("/api/student")
//@CrossOrigin("*")
/*public class StudentController {
    @Autowired
    private EngagementService engagementService;

    @Autowired
    private TestService testService;

    @Autowired
    private BadgeService badgeService;

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private com.platform.services.FeedbackService feedbackService;

    @Autowired
    private AuthService authService;

    @GetMapping("/engagement-history")
    public ResponseEntity<List<EngagementRecord>> getMyHistory() {
        return ResponseEntity.ok(engagementService.getStudentHistory(authService.getCurrentUser().getId()));
    }
*/
    @GetMapping("/full-engagement")
    public ResponseEntity<EngagementDTO> getMyFullEngagement() {
        User student = authService.getCurrentUser();
        EngagementDTO dto = EngagementDTO.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .history(engagementService.getStudentHistory(student.getId()))
                .testHistory(testService.getStudentSubmissions(student.getId()))
                .assessments(selfAssessmentService.getAllAssessments().stream()
                        .filter(a -> a.getStudent().getId().equals(student.getId())).collect(Collectors.toList()))
                .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/tests/current")
    public ResponseEntity<List<WeeklyTest>> getCurrentTests() {
        return ResponseEntity.ok(testService.getAllTests());
    }

    @PostMapping("/tests/{testId}/submit")
    public ResponseEntity<?> submitTest(@PathVariable Long testId, @RequestBody TestSubmissionDTO answers) {
        return ResponseEntity.ok(testService.submitTest(testId, authService.getCurrentUser(), answers.getAnswers()));
    }

    @GetMapping("/badges")
    public ResponseEntity<List<BadgeDTO>> getMyBadges() {
        Long studentId = authService.getCurrentUser().getId();
        List<StudentBadge> studentBadges = badgeService.getStudentBadges(studentId);

        List<BadgeDTO> result = new ArrayList<>();
        for (StudentBadge sb : studentBadges) {
            BadgeDTO dto = new BadgeDTO();
            dto.setName(sb.getBadge().getName());
            dto.setDescription(sb.getBadge().getDescription());
            dto.setIcon(sb.getBadge().getIcon());
            dto.setEarnedAt(sb.getEarnedAt());
            dto.setEarned(true);
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(required = false) Integer week) {
        try {
            Long studentId = authService.getCurrentUser().getId();
            List<LeaderboardDTO> board = leaderboardService.getClassLeaderboard(studentId, week);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to load leaderboard: " + e.getMessage());
        }
    }

    @PostMapping("/leaderboard/privacy")
    public ResponseEntity<?> updatePrivacy(@RequestBody Map<String, Boolean> body) {
        try {
            Long studentId = authService.getCurrentUser().getId();
            leaderboardService.updatePrivacy(studentId, body.get("showName"));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update privacy");
        }
    }

    @GetMapping("/self-assessment/current-week")
    public ResponseEntity<?> getMyAssessmentForWeek(@RequestParam Integer week) {
        return ResponseEntity
                .ok(selfAssessmentService.getStudentAssessment(authService.getCurrentUser().getId(), week));
    }

    @PostMapping("/self-assessment")
    public ResponseEntity<?> submitSelfAssessment(@RequestBody SelfAssessment assessment) {
        assessment.setStudent(authService.getCurrentUser());
        return ResponseEntity.ok(selfAssessmentService.submitAssessment(assessment));
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<com.platform.models.Feedback>> getMyFeedbacks() {
        return ResponseEntity.ok(feedbackService.getStudentFeedbacks(authService.getCurrentUser().getId()));
    }
}
