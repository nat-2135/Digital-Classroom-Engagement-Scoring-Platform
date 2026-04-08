CREATE DATABASE IF NOT EXISTS classroom_engagement;
USE classroom_engagement;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
    show_leaderboard_name BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN','TEACHER','STUDENT') NOT NULL;

CREATE TABLE engagement_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    week INT NOT NULL,
    attendance DOUBLE NOT NULL,
    participation INT NOT NULL, -- 1 to 5
    assignment_status ENUM('ON_TIME', 'LATE', 'NOT_SUBMITTED') NOT NULL,
    engagement_score DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE weekly_tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    week_number INT NOT NULL,
    instructions TEXT,
    questions JSON NOT NULL,
    marks_per_question INT NOT NULL,
    time_limit INT NOT NULL, -- in minutes
    due_date DATETIME NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE test_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    test_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    answers JSON NOT NULL,
    score DOUBLE NOT NULL,
    total_marks DOUBLE NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES weekly_tests(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    trigger_condition VARCHAR(255)
);

CREATE TABLE student_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY(student_id, badge_id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (badge_id) REFERENCES badges(id)
);

CREATE TABLE self_assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    week INT NOT NULL,
    participation_rating INT NOT NULL CHECK (participation_rating BETWEEN 1 AND 5),
    confidence_rating INT NOT NULL CHECK (confidence_rating BETWEEN 1 AND 5),
    comments TEXT,
    teacher_note TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY(student_id, week),
    FOREIGN KEY (student_id) REFERENCES users(id)
);
