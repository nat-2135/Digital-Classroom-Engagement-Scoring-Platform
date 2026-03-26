package com.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_badges")
public class StudentBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "badge_id")
    private Badge badge;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt;

    public StudentBadge() {
    }

    public StudentBadge(Long id, User student, Badge badge, LocalDateTime earnedAt) {
        this.id = id;
        this.student = student;
        this.badge = badge;
        this.earnedAt = earnedAt;
    }

    @PrePersist
    public void prePersist() {
        if (earnedAt == null)
            earnedAt = LocalDateTime.now();
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

    public Badge getBadge() {
        return badge;
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }

    public static class StudentBadgeBuilder {
        private Long id;
        private User student;
        private Badge badge;
        private LocalDateTime earnedAt;

        public StudentBadgeBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public StudentBadgeBuilder student(User student) {
            this.student = student;
            return this;
        }

        public StudentBadgeBuilder badge(Badge badge) {
            this.badge = badge;
            return this;
        }

        public StudentBadgeBuilder earnedAt(LocalDateTime earnedAt) {
            this.earnedAt = earnedAt;
            return this;
        }

        public StudentBadge build() {
            return new StudentBadge(id, student, badge, earnedAt);
        }
    }

    public static StudentBadgeBuilder builder() {
        return new StudentBadgeBuilder();
    }
}
