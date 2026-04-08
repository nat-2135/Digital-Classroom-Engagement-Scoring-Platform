package com.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "engagement_records")
public class EngagementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private Integer week;

    private Double attendance;

    private Integer participation;

    @Column(name = "assignment_status")
    private String assignmentStatus;

    @Column(name = "engagement_score")
    private Double engagementScore;

    @Column(name = "test_score")
    private Integer testScore;

    @Column(name = "test_total_marks")
    private Integer testTotalMarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public EngagementRecord() {
    }

    public EngagementRecord(Long id, User student, Integer week, Double attendance, Integer participation,
            String assignmentStatus, Double engagementScore, Integer testScore, Integer testTotalMarks, LocalDateTime createdAt) {
        this.id = id;
        this.student = student;
        this.week = week;
        this.attendance = attendance;
        this.participation = participation;
        this.assignmentStatus = assignmentStatus;
        this.engagementScore = engagementScore;
        this.testScore = testScore;
        this.testTotalMarks = testTotalMarks;
        this.createdAt = createdAt;
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

    public Double getAttendance() {
        return attendance;
    }

    public void setAttendance(Double attendance) {
        this.attendance = attendance;
    }

    public Integer getParticipation() {
        return participation;
    }

    public void setParticipation(Integer participation) {
        this.participation = participation;
    }

    public String getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(String assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }

    public Double getEngagementScore() {
        return engagementScore;
    }

    public void setEngagementScore(Double engagementScore) {
        this.engagementScore = engagementScore;
    }

    public Integer getTestScore() {
        return testScore;
    }

    public void setTestScore(Integer testScore) {
        this.testScore = testScore;
    }

    public Integer getTestTotalMarks() {
        return testTotalMarks;
    }

    public void setTestTotalMarks(Integer testTotalMarks) {
        this.testTotalMarks = testTotalMarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class EngagementRecordBuilder {
        private Long id;
        private User student;
        private Integer week;
        private Double attendance;
        private Integer participation;
        private String assignmentStatus;
        private Double engagementScore;
        private Integer testScore;
        private Integer testTotalMarks;
        private LocalDateTime createdAt;

        public EngagementRecordBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public EngagementRecordBuilder student(User student) {
            this.student = student;
            return this;
        }

        public EngagementRecordBuilder week(Integer week) {
            this.week = week;
            return this;
        }

        public EngagementRecordBuilder attendance(Double attendance) {
            this.attendance = attendance;
            return this;
        }

        public EngagementRecordBuilder participation(Integer participation) {
            this.participation = participation;
            return this;
        }

        public EngagementRecordBuilder assignmentStatus(String assignmentStatus) {
            this.assignmentStatus = assignmentStatus;
            return this;
        }

        public EngagementRecordBuilder engagementScore(Double engagementScore) {
            this.engagementScore = engagementScore;
            return this;
        }

        public EngagementRecordBuilder testScore(Integer testScore) {
            this.testScore = testScore;
            return this;
        }

        public EngagementRecordBuilder testTotalMarks(Integer testTotalMarks) {
            this.testTotalMarks = testTotalMarks;
            return this;
        }

        public EngagementRecordBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public EngagementRecord build() {
            return new EngagementRecord(id, student, week, attendance, participation, assignmentStatus, engagementScore,
                    testScore, testTotalMarks, createdAt);
        }
    }

    public static EngagementRecordBuilder builder() {
        return new EngagementRecordBuilder();
    }
}
