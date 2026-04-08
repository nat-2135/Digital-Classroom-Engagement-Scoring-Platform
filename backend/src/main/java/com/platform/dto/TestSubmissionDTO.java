package com.platform.dto;

public class TestSubmissionDTO {
    private String answers;

    public TestSubmissionDTO() {
    }

    public TestSubmissionDTO(String answers) {
        this.answers = answers;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }
}
