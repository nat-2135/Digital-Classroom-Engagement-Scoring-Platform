package com.platform.controllers;

import com.platform.dto.EngagementDTO;
import com.platform.dto.LeaderboardDTO;
import com.platform.dto.UserRequestDTO;
import com.platform.dto.UserResponseDTO;
import com.platform.models.Role;
import com.platform.models.User;
import com.platform.repository.UserRepository;
import com.platform.services.AdminService;
import com.platform.services.EngagementService;
import com.platform.services.LeaderboardService;
import com.platform.services.SelfAssessmentService;
import com.platform.services.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EngagementService engagementService;

    @Autowired
    private TestService testService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getAdminLeaderboard(@RequestParam(required = false) Integer week) {
        try {
            List<LeaderboardDTO> board = leaderboardService.getClassLeaderboard(-1L, week);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        try {
            long studentCount = userRepository.countByRole(Role.STUDENT);
            long teacherCount = userRepository.countByRole(Role.TEACHER);
            long totalCount = userRepository.count();
            return ResponseEntity.ok(Map.of(
                "studentCount", studentCount,
                "teacherCount", teacherCount,
                "totalCount", totalCount
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all-students/engagement-history")
    public ResponseEntity<List<EngagementDTO>> getAllStudentsHistory() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        
        // Optimizing by fetching all required data in bulk to avoid N+1 queries
        List<com.platform.models.EngagementRecord> allHistory = engagementService.getAllHistory();
        List<com.platform.models.TestSubmission> allSubmissions = testService.getAllSubmissions();
        List<com.platform.models.SelfAssessment> allAssessments = selfAssessmentService.getAllAssessments();

        List<EngagementDTO> history = students.stream().map(student -> {
            List<com.platform.models.EngagementRecord> studentHistory = allHistory.stream()
                .filter(h -> h.getStudent().getId().equals(student.getId()))
                .collect(Collectors.toList());
                
            List<com.platform.models.TestSubmission> studentSubmissions = allSubmissions.stream()
                .filter(s -> s.getStudent().getId().equals(student.getId()))
                .collect(Collectors.toList());
                
            List<com.platform.models.SelfAssessment> studentAssessments = allAssessments.stream()
                .filter(a -> a.getStudent().getId().equals(student.getId()))
                .collect(Collectors.toList());

            return EngagementDTO.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .history(studentHistory)
                .testHistory(studentSubmissions)
                .assessments(studentAssessments)
                .build();
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(history);
    }

    // ── STUDENTS ──────────────────────────────

    @GetMapping("/students")
    public ResponseEntity<?> getStudents() {
        try {
            List<User> students = adminService.getAllStudents();
            List<UserResponseDTO> response = students.stream().map(u -> UserResponseDTO.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .role(u.getRole().name())
                    .createdAt(u.getCreatedAt())
                    .build()).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody UserRequestDTO dto) {
        try {
            if (dto.getName() == null || dto.getName().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            if (dto.getEmail() == null || dto.getEmail().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            if (dto.getPassword() == null || dto.getPassword().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));

            User saved = adminService.addStudent(dto);
            return ResponseEntity.ok(UserResponseDTO.builder()
                    .id(saved.getId())
                    .name(saved.getName())
                    .email(saved.getEmail())
                    .role(saved.getRole().name())
                    .createdAt(saved.getCreatedAt())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody UserRequestDTO dto) {
        try {
            User updated = adminService.updateStudent(id, dto);
            return ResponseEntity.ok(UserResponseDTO.builder()
                    .id(updated.getId())
                    .name(updated.getName())
                    .email(updated.getEmail())
                    .role(updated.getRole().name())
                    .createdAt(updated.getCreatedAt())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            adminService.deleteStudent(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Student deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── TEACHERS ──────────────────────────────

    @GetMapping("/teachers")
    public ResponseEntity<?> getTeachers() {
        try {
            List<User> teachers = adminService.getAllTeachers();
            List<UserResponseDTO> response = teachers.stream().map(u -> UserResponseDTO.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .role(u.getRole().name())
                    .createdAt(u.getCreatedAt())
                    .build()).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/teachers")
    public ResponseEntity<?> addTeacher(@RequestBody UserRequestDTO dto) {
        try {
            if (dto.getName() == null || dto.getName().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            if (dto.getEmail() == null || dto.getEmail().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            if (dto.getPassword() == null || dto.getPassword().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));

            User saved = adminService.addTeacher(dto);
            return ResponseEntity.ok(UserResponseDTO.builder()
                    .id(saved.getId())
                    .name(saved.getName())
                    .email(saved.getEmail())
                    .role(saved.getRole().name())
                    .createdAt(saved.getCreatedAt())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/teachers/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @RequestBody UserRequestDTO dto) {
        try {
            User updated = adminService.updateTeacher(id, dto);
            return ResponseEntity.ok(UserResponseDTO.builder()
                    .id(updated.getId())
                    .name(updated.getName())
                    .email(updated.getEmail())
                    .role(updated.getRole().name())
                    .createdAt(updated.getCreatedAt())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        try {
            adminService.deleteTeacher(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Teacher deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/cleanup-all")
    public ResponseEntity<?> cleanupAllUsers() {
        try {
            adminService.deleteAllNonAdminUsers();
            return ResponseEntity.ok(Map.of("success", true, "message", "All students and teachers removed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
