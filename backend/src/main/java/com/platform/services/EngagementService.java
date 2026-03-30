package com.platform.services;

import com.platform.models.EngagementRecord;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EngagementService {

    public String test() {
        return "Service working";
    }

    // TEMP FIX: return empty list
    public List<EngagementRecord> getStudentHistory(Long studentId) {
        return new ArrayList<>();
    }

    // TEMP FIX: return dummy object
    public EngagementRecord saveEngagement(
            Long studentId,
            Integer week,
            Double attendance,
            Integer participation,
            String assignmentStatus) {

        return new EngagementRecord();
    }
}