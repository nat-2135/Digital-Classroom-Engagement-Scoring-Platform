package com.platform.services;

import com.platform.dto.UserRequestDTO;
import com.platform.models.Role;
import com.platform.models.User;
import com.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Service
@Transactional
public class AdminService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ── STUDENTS ──────────────────────────────

    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    public User addStudent(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.STUDENT)
                .showLeaderboardName(true)
                .build();
        return userRepository.save(user);
    }

    public User updateStudent(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return userRepository.save(user);
    }

    public void deleteStudent(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Student not found: " + id);
        }
        deleteUserAndRelatedData(id);
    }

    // ── TEACHERS ──────────────────────────────

    public List<User> getAllTeachers() {
        return userRepository.findByRole(Role.TEACHER);
    }

    public User addTeacher(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.TEACHER)
                .showLeaderboardName(true)
                .build();
        return userRepository.save(user);
    }

    public User updateTeacher(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + id));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return userRepository.save(user);
    }

    public void deleteTeacher(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found: " + id);
        }
        deleteUserAndRelatedData(id);
    }

    // ── Common delete helper ──────────────────────────────

    private void deleteUserAndRelatedData(Long userId) {
        // Delete all possible foreign key references using native SQL
        entityManager.createNativeQuery("DELETE FROM engagement_records WHERE student_id = :id").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM test_submissions WHERE student_id = :id").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM self_assessments WHERE student_id = :id").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM student_badges WHERE student_id = :id").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM feedback WHERE student_id = :id").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM feedback WHERE teacher_id = :id").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM test_submissions WHERE test_id IN (SELECT id FROM weekly_tests WHERE teacher_id = :id)").setParameter("id", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM weekly_tests WHERE teacher_id = :id").setParameter("id", userId).executeUpdate();
        // Final delete of user record itself via native SQL to bypass Hibernate cache
        entityManager.createNativeQuery("DELETE FROM users WHERE id = :id").setParameter("id", userId).executeUpdate();
        entityManager.flush();
        entityManager.clear();
    }

    // ── Bulk cleanup ──────────────────────────────

    public void deleteAllNonAdminUsers() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<User> teachers = userRepository.findByRole(Role.TEACHER);
        for (User u : students) {
            deleteUserAndRelatedData(u.getId());
        }
        for (User u : teachers) {
            deleteUserAndRelatedData(u.getId());
        }
    }
}
