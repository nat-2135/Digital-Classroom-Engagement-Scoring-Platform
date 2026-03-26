package com.platform.services;

import com.platform.models.SelfAssessment;
import com.platform.repository.SelfAssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SelfAssessmentService {
    @Autowired
    private SelfAssessmentRepository selfAssessmentRepository;

    @Autowired
    private BadgeService badgeService;

    public SelfAssessment submitAssessment(SelfAssessment assessment) {
        assessment.setSubmittedAt(LocalDateTime.now());
        SelfAssessment saved = selfAssessmentRepository.save(assessment);

        // Trigger badge check
        badgeService.checkAndAwardBadges(assessment.getStudent().getId());

        return saved;
    }

    public List<SelfAssessment> getAssessmentsByWeek(Integer week) {
        return selfAssessmentRepository.findByWeek(week);
    }

    public Optional<SelfAssessment> getStudentAssessment(Long studentId, Integer week) {
        return selfAssessmentRepository.findByStudentIdAndWeek(studentId, week);
    }

    public List<SelfAssessment> getAllAssessments() {
        return selfAssessmentRepository.findAll();
    }

    public void addTeacherNote(Long studentId, Integer week, String note) {
        SelfAssessment assessment = selfAssessmentRepository.findByStudentIdAndWeek(studentId, week).orElseThrow();
        assessment.setTeacherNote(note);
        selfAssessmentRepository.save(assessment);
    }
}
