package com.platform.dto;

import com.platform.models.EngagementRecord;
import com.platform.models.TestSubmission;
import com.platform.models.SelfAssessment;
import java.util.List;

public class EngagementDTO {
    private Long studentId;
    private String studentName;
    private Integer week;
    private Double attendance;
    private Integer participation;
    private String assignmentStatus;
    private Double engagementScore;
    private Integer testScore;
    private Integer testTotalMarks;
    private Integer selfParticipationRating;
    private Integer selfConfidenceRating;
    private List<EngagementRecord> history;
    private List<TestSubmission> testHistory;
    private List<SelfAssessment> assessments;

    public EngagementDTO() {
    }

    public EngagementDTO(Long studentId, String studentName, Integer week, Double attendance, Integer participation,
            String assignmentStatus, Double engagementScore, Integer testScore, Integer testTotalMarks,
            Integer selfParticipationRating, Integer selfConfidenceRating, List<EngagementRecord> history,
            List<TestSubmission> testHistory, List<SelfAssessment> assessments) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.week = week;
        this.attendance = attendance;
        this.participation = participation;
        this.assignmentStatus = assignmentStatus;
        this.engagementScore = engagementScore;
        this.testScore = testScore;
        this.testTotalMarks = testTotalMarks;
        this.selfParticipationRating = selfParticipationRating;
        this.selfConfidenceRating = selfConfidenceRating;
        this.history = history;
        this.testHistory = testHistory;
        this.assessments = assessments;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
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

    public Integer getSelfParticipationRating() {
        return selfParticipationRating;
    }

    public void setSelfParticipationRating(Integer selfParticipationRating) {
        this.selfParticipationRating = selfParticipationRating;
    }

    public Integer getSelfConfidenceRating() {
        return selfConfidenceRating;
    }

    public void setSelfConfidenceRating(Integer selfConfidenceRating) {
        this.selfConfidenceRating = selfConfidenceRating;
    }

    public List<EngagementRecord> getHistory() {
        return history;
    }

    public void setHistory(List<EngagementRecord> history) {
        this.history = history;
    }

    public List<TestSubmission> getTestHistory() {
        return testHistory;
    }

    public void setTestHistory(List<TestSubmission> testHistory) {
        this.testHistory = testHistory;
    }

    public List<SelfAssessment> getAssessments() {
        return assessments;
    }

    public void setAssessments(List<SelfAssessment> assessments) {
        this.assessments = assessments;
    }

    public static class EngagementDTOBuilder {
        private Long studentId;
        private String studentName;
        private Integer week;
        private Double attendance;
        private Integer participation;
        private String assignmentStatus;
        private Double engagementScore;
        private Integer testScore;
        private Integer testTotalMarks;
        private Integer selfParticipationRating;
        private Integer selfConfidenceRating;
        private List<EngagementRecord> history;
        private List<TestSubmission> testHistory;
        private List<SelfAssessment> assessments;

        public EngagementDTOBuilder studentId(Long studentId) {
            this.studentId = studentId;
            return this;
        }

        public EngagementDTOBuilder studentName(String studentName) {
            this.studentName = studentName;
            return this;
        }

        public EngagementDTOBuilder week(Integer week) {
            this.week = week;
            return this;
        }

        public EngagementDTOBuilder attendance(Double attendance) {
            this.attendance = attendance;
            return this;
        }

        public EngagementDTOBuilder participation(Integer participation) {
            this.participation = participation;
            return this;
        }

        public EngagementDTOBuilder assignmentStatus(String assignmentStatus) {
            this.assignmentStatus = assignmentStatus;
            return this;
        }

        public EngagementDTOBuilder engagementScore(Double engagementScore) {
            this.engagementScore = engagementScore;
            return this;
        }

        public EngagementDTOBuilder testScore(Integer testScore) {
            this.testScore = testScore;
            return this;
        }

        public EngagementDTOBuilder testTotalMarks(Integer testTotalMarks) {
            this.testTotalMarks = testTotalMarks;
            return this;
        }

        public EngagementDTOBuilder selfParticipationRating(Integer selfParticipationRating) {
            this.selfParticipationRating = selfParticipationRating;
            return this;
        }

        public EngagementDTOBuilder selfConfidenceRating(Integer selfConfidenceRating) {
            this.selfConfidenceRating = selfConfidenceRating;
            return this;
        }

        public EngagementDTOBuilder history(List<EngagementRecord> history) {
            this.history = history;
            return this;
        }

        public EngagementDTOBuilder testHistory(List<TestSubmission> testHistory) {
            this.testHistory = testHistory;
            return this;
        }

        public EngagementDTOBuilder assessments(List<SelfAssessment> assessments) {
            this.assessments = assessments;
            return this;
        }

        public EngagementDTO build() {
            return new EngagementDTO(studentId, studentName, week, attendance, participation, assignmentStatus,
                    engagementScore, testScore, testTotalMarks, selfParticipationRating, selfConfidenceRating, history,
                    testHistory, assessments);
        }
    }

    public static EngagementDTOBuilder builder() {
        return new EngagementDTOBuilder();
    }
}
