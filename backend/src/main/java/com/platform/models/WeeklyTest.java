package com.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_tests")
public class WeeklyTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    private String title;
    private String subject;
    private Integer weekNumber;
    private String instructions;

    @Column(columnDefinition = "JSON")
    private String questions;

    private Integer marksPerQuestion;
    private Integer timeLimit;
    private LocalDateTime dueDate;

    public WeeklyTest() {
    }

    public WeeklyTest(Long id, User teacher, String title, String subject, Integer weekNumber, String instructions,
            String questions, Integer marksPerQuestion, Integer timeLimit, LocalDateTime dueDate) {
        this.id = id;
        this.teacher = teacher;
        this.title = title;
        this.subject = subject;
        this.weekNumber = weekNumber;
        this.instructions = instructions;
        this.questions = questions;
        this.marksPerQuestion = marksPerQuestion;
        this.timeLimit = timeLimit;
        this.dueDate = dueDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(Integer weekNumber) {
        this.weekNumber = weekNumber;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }

    public Integer getMarksPerQuestion() {
        return marksPerQuestion;
    }

    public void setMarksPerQuestion(Integer marksPerQuestion) {
        this.marksPerQuestion = marksPerQuestion;
    }

    public Integer getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public static class WeeklyTestBuilder {
        private Long id;
        private User teacher;
        private String title;
        private String subject;
        private Integer weekNumber;
        private String instructions;
        private String questions;
        private Integer marksPerQuestion;
        private Integer timeLimit;
        private LocalDateTime dueDate;

        public WeeklyTestBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WeeklyTestBuilder teacher(User teacher) {
            this.teacher = teacher;
            return this;
        }

        public WeeklyTestBuilder title(String title) {
            this.title = title;
            return this;
        }

        public WeeklyTestBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public WeeklyTestBuilder weekNumber(Integer weekNumber) {
            this.weekNumber = weekNumber;
            return this;
        }

        public WeeklyTestBuilder instructions(String instructions) {
            this.instructions = instructions;
            return this;
        }

        public WeeklyTestBuilder questions(String questions) {
            this.questions = questions;
            return this;
        }

        public WeeklyTestBuilder marksPerQuestion(Integer marksPerQuestion) {
            this.marksPerQuestion = marksPerQuestion;
            return this;
        }

        public WeeklyTestBuilder timeLimit(Integer timeLimit) {
            this.timeLimit = timeLimit;
            return this;
        }

        public WeeklyTestBuilder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public WeeklyTest build() {
            return new WeeklyTest(id, teacher, title, subject, weekNumber, instructions, questions, marksPerQuestion,
                    timeLimit, dueDate);
        }
    }

    public static WeeklyTestBuilder builder() {
        return new WeeklyTestBuilder();
    }
}
