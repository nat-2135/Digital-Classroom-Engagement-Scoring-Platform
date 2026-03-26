package com.platform.services;

import com.platform.models.TestSubmission;
import com.platform.models.User;
import com.platform.models.WeeklyTest;
import com.platform.repository.TestSubmissionRepository;
import com.platform.repository.WeeklyTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TestService {
    @Autowired
    private WeeklyTestRepository weeklyTestRepository;

    @Autowired
    private TestSubmissionRepository testSubmissionRepository;

    @Autowired
    private BadgeService badgeService;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    public WeeklyTest createTest(WeeklyTest test) {
        return weeklyTestRepository.save(test);
    }

    public List<WeeklyTest> getTestsByTeacher(Long teacherId) {
        return weeklyTestRepository.findByTeacherId(teacherId);
    }

    public List<WeeklyTest> getAllTests() {
        return weeklyTestRepository.findAll();
    }

    public TestSubmission submitTest(Long testId, User student, String answersJson) {
        WeeklyTest test = weeklyTestRepository.findById(testId).orElseThrow();
        int totalScore = 0;
        int maxPossible = 0;
        
        try {
            java.util.List<java.util.Map<String, Object>> questions = objectMapper.readValue(test.getQuestions(), 
                new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
            
            java.util.Map<String, String> studentAnswers = objectMapper.readValue(answersJson, 
                new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, String>>() {});

            int marksPerQ = test.getMarksPerQuestion() != null ? test.getMarksPerQuestion() : 10;
            maxPossible = questions.size() * marksPerQ;

            for (java.util.Map<String, Object> q : questions) {
                String qId = String.valueOf(q.get("id"));
                String correct = String.valueOf(q.get("correctAnswer"));
                String studentAns = studentAnswers.get(qId);
                
                if (correct != null && studentAns != null && correct.trim().equalsIgnoreCase(studentAns.trim())) {
                    totalScore += marksPerQ;
                }
            }
        } catch (Exception e) {
            // Fallback to random if parsing fails, but ideally log this
            totalScore = 0;
        }

        TestSubmission submission = TestSubmission.builder()
                .test(test)
                .student(student)
                .answers(answersJson)
                .score(totalScore)
                .totalMarks(maxPossible > 0 ? maxPossible : 100)
                .submittedAt(LocalDateTime.now())
                .build();

        TestSubmission saved = testSubmissionRepository.save(submission);
        badgeService.checkAndAwardBadges(student.getId());
        return saved;
    }

    public TestSubmission updateTestScore(Long submissionId, Integer newScore) {
        TestSubmission submission = testSubmissionRepository.findById(submissionId).orElseThrow();
        submission.setScore(newScore);
        return testSubmissionRepository.save(submission);
    }

    public List<TestSubmission> getSubmissionsByTest(Long testId) {
        return testSubmissionRepository.findByTestId(testId);
    }

    public List<TestSubmission> getStudentSubmissions(Long studentId) {
        return testSubmissionRepository.findByStudentId(studentId);
    }
}
