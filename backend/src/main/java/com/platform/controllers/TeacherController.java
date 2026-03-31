package com.platform.controllers;

import com.platform.dto.EngagementDTO;
import com.platform.models.*;
import com.platform.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.platform.dto.LeaderboardDTO;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin("*")
public class TeacherController {
    @Autowired
    private EngagementService engagementService;

    @Autowired
    private TestService testService;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AuthService authService;

    @Autowired
    private com.platform.repository.UserRepository userRepository;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getTeacherLeaderboard(@RequestParam(required = false) Integer week) {
        try {
            List<LeaderboardDTO> board = leaderboardService.getClassLeaderboard(-1L, week);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/students/engagement-history")
    public ResponseEntity<?> getAllStudentsHistory() {
        try {
            List<User> students = userRepository.findByRole(Role.STUDENT);
            List<EngagementRecord> allHistory = engagementService.getAllHistory();
            List<com.platform.models.TestSubmission> allSubmissions = testService.getAllSubmissions();
            List<SelfAssessment> allAssessments = selfAssessmentService.getAllAssessments();

            List<com.platform.dto.EngagementDTO> history = students.stream().map(student -> com.platform.dto.EngagementDTO.builder()
                    .studentId(student.getId())
                    .studentName(student.getName())
                    .history(allHistory.stream().filter(h -> h.getStudent() != null && student.getId().equals(h.getStudent().getId())).collect(Collectors.toList()))
                    .testHistory(allSubmissions.stream().filter(s -> s.getStudent() != null && student.getId().equals(s.getStudent().getId())).collect(Collectors.toList()))
                    .assessments(allAssessments.stream().filter(a -> a.getStudent() != null && student.getId().equals(a.getStudent().getId())).collect(Collectors.toList()))
                    .build()).collect(Collectors.toList());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal Platform Error: " + e.getMessage()));
        }
    }

    @GetMapping("/students/{id}/full-engagement")
    public ResponseEntity<EngagementDTO> getStudentFullEngagement(@PathVariable Long id) {
        User student = userRepository.findById(id).orElseThrow();
        EngagementDTO dto = EngagementDTO.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .history(engagementService.getStudentHistory(id))
                .testHistory(testService.getStudentSubmissions(id))
                .assessments(selfAssessmentService.getAllAssessments().stream()
                        .filter(a -> a.getStudent().getId().equals(id)).collect(Collectors.toList()))
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> sendFeedback(@RequestBody Map<String, Object> request) {
        User student = userRepository.findById(Long.valueOf(request.get("studentId").toString())).orElseThrow();
        User teacher = authService.getCurrentUser();
        return ResponseEntity.ok(feedbackService.sendFeedback(student, teacher, request.get("message").toString()));
    }

    @PostMapping("/tests/create")
    public ResponseEntity<?> createTest(@RequestBody WeeklyTest test) {
        test.setTeacher(authService.getCurrentUser());
        return ResponseEntity.ok(testService.createTest(test));
    }

    @GetMapping("/tests")
    public ResponseEntity<List<WeeklyTest>> getMyTests() {
        return ResponseEntity.ok(testService.getTestsByTeacher(authService.getCurrentUser().getId()));
    }

    @GetMapping("/tests/{testId}/submissions")
    public ResponseEntity<List<TestSubmission>> getTestSubmissions(@PathVariable Long testId) {
        return ResponseEntity.ok(testService.getSubmissionsByTest(testId));
    }

    @GetMapping("/self-assessments")
    public ResponseEntity<List<SelfAssessment>> getAllSelfAssessments() {
        return ResponseEntity.ok(selfAssessmentService.getAllAssessments());
    }

    @PostMapping("/assessment-note")
    public ResponseEntity<?> addAssessmentNote(@RequestBody Map<String, String> request) {
        Long studentId = Long.valueOf(request.get("studentId"));
        Integer week = Integer.valueOf(request.get("week"));
        String note = request.get("note");
        selfAssessmentService.addTeacherNote(studentId, week, note);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getStudentsList() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        return ResponseEntity.ok(students.stream().map(s -> Map.of(
            "id", (Object) s.getId(),
            "name", (Object) (s.getName() != null ? s.getName() : s.getEmail().split("@")[0])
        )).collect(Collectors.toList()));
    }

    @GetMapping("/students/{id}/latest-engagement")
    public ResponseEntity<EngagementRecord> getLatestEngagement(@PathVariable Long id) {
        List<EngagementRecord> history = engagementService.getStudentHistory(id);
        if (history.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(history.get(history.size() - 1));
    }

    @PostMapping("/engagement")
    public ResponseEntity<?> saveEngagement(@RequestBody Map<String, Object> request) {
        try {
            Object sId = request.get("studentId");
            if (sId == null) return ResponseEntity.badRequest().body(Map.of("error", "Student ID missing"));
            Long studentId = Long.valueOf(sId.toString());

            Integer week = request.get("week") != null ? Integer.valueOf(request.get("week").toString()) : 1;
            Double attendance = request.get("attendance") != null ? Double.valueOf(request.get("attendance").toString()) : 0.0;
            Integer participation = request.get("participation") != null ? Integer.valueOf(request.get("participation").toString()) : 1;
            String assignmentStatus = request.get("assignmentStatus") != null ? request.get("assignmentStatus").toString() : "NOT_SUBMITTED";

            return ResponseEntity.ok(engagementService.saveEngagement(studentId, week, attendance, participation, assignmentStatus));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Save failed: " + e.getMessage()));
        }
    }

    @PutMapping("/engagement/{id}")
    public ResponseEntity<?> updateEngagement(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Long studentId = Long.valueOf(request.get("studentId").toString());
        Integer week = Integer.valueOf(request.get("week").toString());
        Double attendance = Double.valueOf(request.get("attendance").toString());
        Integer participation = Integer.valueOf(request.get("participation").toString());
        String assignmentStatus = request.get("assignmentStatus").toString();

        return ResponseEntity
                .ok(engagementService.saveEngagement(studentId, week, attendance, participation, assignmentStatus));
    }

    @PutMapping("/tests/submissions/{id}")
    public ResponseEntity<?> updateSubmissionScore(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        return ResponseEntity.ok(testService.updateTestScore(id, request.get("score")));
    }
}
