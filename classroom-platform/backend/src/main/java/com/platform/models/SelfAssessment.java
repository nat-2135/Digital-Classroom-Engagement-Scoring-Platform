package com.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "self_assessments")
public class SelfAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private Integer week;

    @Column(name = "participation_rating")
    private Integer participationRating;

    @Column(name = "confidence_rating")
    private Integer confidenceRating;

    private String comments;

    @Column(name = "teacher_note")
    private String teacherNote;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    public SelfAssessment() {
    }

    public SelfAssessment(Long id, User student, Integer week, Integer participationRating, Integer confidenceRating,
            String comments, String teacherNote, LocalDateTime submittedAt) {
        this.id = id;
        this.student = student;
        this.week = week;
        this.participationRating = participationRating;
        this.confidenceRating = confidenceRating;
        this.comments = comments;
        this.teacherNote = teacherNote;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public Integer getParticipationRating() {
        return participationRating;
    }

    public void setParticipationRating(Integer participationRating) {
        this.participationRating = participationRating;
    }

    public Integer getConfidenceRating() {
        return confidenceRating;
    }

    public void setConfidenceRating(Integer confidenceRating) {
        this.confidenceRating = confidenceRating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getTeacherNote() {
        return teacherNote;
    }

    public void setTeacherNote(String teacherNote) {
        this.teacherNote = teacherNote;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public static class SelfAssessmentBuilder {
        private Long id;
        private User student;
        private Integer week;
        private Integer participationRating;
        private Integer confidenceRating;
        private String comments;
        private String teacherNote;
        private LocalDateTime submittedAt;

        public SelfAssessmentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SelfAssessmentBuilder student(User student) {
            this.student = student;
            return this;
        }

        public SelfAssessmentBuilder week(Integer week) {
            this.week = week;
            return this;
        }

        public SelfAssessmentBuilder participationRating(Integer participationRating) {
            this.participationRating = participationRating;
            return this;
        }

        public SelfAssessmentBuilder confidenceRating(Integer confidenceRating) {
            this.confidenceRating = confidenceRating;
            return this;
        }

        public SelfAssessmentBuilder comments(String comments) {
            this.comments = comments;
            return this;
        }

        public SelfAssessmentBuilder teacherNote(String teacherNote) {
            this.teacherNote = teacherNote;
            return this;
        }

        public SelfAssessmentBuilder submittedAt(LocalDateTime submittedAt) {
            this.submittedAt = submittedAt;
            return this;
        }

        public SelfAssessment build() {
            return new SelfAssessment(id, student, week, participationRating, confidenceRating, comments, teacherNote,
                    submittedAt);
        }
    }

    public static SelfAssessmentBuilder builder() {
        return new SelfAssessmentBuilder();
    }
}
