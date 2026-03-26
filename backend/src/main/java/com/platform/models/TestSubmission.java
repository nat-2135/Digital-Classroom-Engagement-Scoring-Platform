package com.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_submissions")
public class TestSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private WeeklyTest test;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Column(columnDefinition = "JSON")
    private String answers;

    private Integer score;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    public TestSubmission() {
    }

    public TestSubmission(Long id, WeeklyTest test, User student, String answers, Integer score, Integer totalMarks,
            LocalDateTime submittedAt) {
        this.id = id;
        this.test = test;
        this.student = student;
        this.answers = answers;
        this.score = score;
        this.totalMarks = totalMarks;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WeeklyTest getTest() {
        return test;
    }

    public void setTest(WeeklyTest test) {
        this.test = test;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public static class TestSubmissionBuilder {
        private Long id;
        private WeeklyTest test;
        private User student;
        private String answers;
        private Integer score;
        private Integer totalMarks;
        private LocalDateTime submittedAt;

        public TestSubmissionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TestSubmissionBuilder test(WeeklyTest test) {
            this.test = test;
            return this;
        }

        public TestSubmissionBuilder student(User student) {
            this.student = student;
            return this;
        }

        public TestSubmissionBuilder answers(String answers) {
            this.answers = answers;
            return this;
        }

        public TestSubmissionBuilder score(Integer score) {
            this.score = score;
            return this;
        }

        public TestSubmissionBuilder totalMarks(Integer totalMarks) {
            this.totalMarks = totalMarks;
            return this;
        }

        public TestSubmissionBuilder submittedAt(LocalDateTime submittedAt) {
            this.submittedAt = submittedAt;
            return this;
        }

        public TestSubmission build() {
            return new TestSubmission(id, test, student, answers, score, totalMarks, submittedAt);
        }
    }

    public static TestSubmissionBuilder builder() {
        return new TestSubmissionBuilder();
    }
}
