package com.platform.dto;

public class LeaderboardDTO {
    private Long studentId;
    private int rank;
    private String displayName;
    private Double engagementScore;
    private Double attendanceAvg;
    private Double participationAvg;
    private Double assignmentAvg;
    private Double testScoreAvg;
    private boolean isCurrentUser;
    private boolean isAnonymous;
    private int badgeCount;

    public LeaderboardDTO() {
    }

    public LeaderboardDTO(Long studentId, int rank, String displayName, Double engagementScore, Double attendanceAvg, Double participationAvg, Double assignmentAvg, Double testScoreAvg, boolean isCurrentUser, boolean isAnonymous, int badgeCount) {
        this.studentId = studentId;
        this.rank = rank;
        this.displayName = displayName;
        this.engagementScore = engagementScore;
        this.attendanceAvg = attendanceAvg;
        this.participationAvg = participationAvg;
        this.assignmentAvg = assignmentAvg;
        this.testScoreAvg = testScoreAvg;
        this.isCurrentUser = isCurrentUser;
        this.isAnonymous = isAnonymous;
        this.badgeCount = badgeCount;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Double getEngagementScore() {
        return engagementScore;
    }

    public void setEngagementScore(Double engagementScore) {
        this.engagementScore = engagementScore;
    }

    public Double getAttendanceAvg() {
        return attendanceAvg;
    }

    public void setAttendanceAvg(Double attendanceAvg) {
        this.attendanceAvg = attendanceAvg;
    }

    public Double getParticipationAvg() {
        return participationAvg;
    }

    public void setParticipationAvg(Double participationAvg) {
        this.participationAvg = participationAvg;
    }

    public Double getAssignmentAvg() {
        return assignmentAvg;
    }

    public void setAssignmentAvg(Double assignmentAvg) {
        this.assignmentAvg = assignmentAvg;
    }

    public Double getTestScoreAvg() {
        return testScoreAvg;
    }

    public void setTestScoreAvg(Double testScoreAvg) {
        this.testScoreAvg = testScoreAvg;
    }

    public boolean isCurrentUser() {
        return isCurrentUser;
    }

    public void setCurrentUser(boolean currentUser) {
        isCurrentUser = currentUser;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    public int getBadgeCount() {
        return badgeCount;
    }

    public void setBadgeCount(int badgeCount) {
        this.badgeCount = badgeCount;
    }

    public static class LeaderboardDTOBuilder {
        private Long studentId;
        private int rank;
        private String displayName;
        private Double engagementScore;
        private Double attendanceAvg;
        private Double participationAvg;
        private Double assignmentAvg;
        private Double testScoreAvg;
        private boolean isCurrentUser;
        private boolean isAnonymous;
        private int badgeCount;

        public LeaderboardDTOBuilder studentId(Long studentId) {
            this.studentId = studentId;
            return this;
        }

        public LeaderboardDTOBuilder rank(int rank) {
            this.rank = rank;
            return this;
        }

        public LeaderboardDTOBuilder displayName(String displayName) {
            this.displayName = displayName;
            return this;
        }

        public LeaderboardDTOBuilder engagementScore(Double engagementScore) {
            this.engagementScore = engagementScore;
            return this;
        }

        public LeaderboardDTOBuilder attendanceAvg(Double attendanceAvg) {
            this.attendanceAvg = attendanceAvg;
            return this;
        }

        public LeaderboardDTOBuilder participationAvg(Double participationAvg) {
            this.participationAvg = participationAvg;
            return this;
        }

        public LeaderboardDTOBuilder assignmentAvg(Double assignmentAvg) {
            this.assignmentAvg = assignmentAvg;
            return this;
        }

        public LeaderboardDTOBuilder testScoreAvg(Double testScoreAvg) {
            this.testScoreAvg = testScoreAvg;
            return this;
        }

        public LeaderboardDTOBuilder isCurrentUser(boolean isCurrentUser) {
            this.isCurrentUser = isCurrentUser;
            return this;
        }

        public LeaderboardDTOBuilder isAnonymous(boolean isAnonymous) {
            this.isAnonymous = isAnonymous;
            return this;
        }

        public LeaderboardDTOBuilder badgeCount(int badgeCount) {
            this.badgeCount = badgeCount;
            return this;
        }

        public LeaderboardDTO build() {
            return new LeaderboardDTO(studentId, rank, displayName, engagementScore, attendanceAvg, participationAvg, assignmentAvg, testScoreAvg, isCurrentUser, isAnonymous, badgeCount);
        }
    }

    public static LeaderboardDTOBuilder builder() {
        return new LeaderboardDTOBuilder();
    }
}
