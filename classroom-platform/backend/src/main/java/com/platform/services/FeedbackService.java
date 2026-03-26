package com.platform.services;

import com.platform.models.Feedback;
import com.platform.models.User;
import com.platform.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback sendFeedback(User student, User teacher, String message) {
        System.out.println("DEBUG: Sending feedback to student=" + student.getName() + " (ID=" + student.getId() + ") from teacher=" + teacher.getName() + " (ID=" + teacher.getId() + ")");
        Feedback feedback = new Feedback(student, teacher, message);
        Feedback saved = feedbackRepository.save(feedback);
        System.out.println("DEBUG: Feedback saved. ID=" + saved.getId());
        return saved;
    }

    public List<Feedback> getStudentFeedbacks(Long studentId) {
        System.out.println("DEBUG: Fetching feedbacks for studentId=" + studentId);
        List<Feedback> result = feedbackRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        System.out.println("DEBUG: Found count=" + result.size());
        return result;
    }
}
