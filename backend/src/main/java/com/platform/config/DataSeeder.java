package com.platform.config;

import com.platform.models.Role;
import com.platform.models.User;
import com.platform.models.WeeklyTest;
import com.platform.models.EngagementRecord;
import com.platform.models.Feedback;
import com.platform.models.SelfAssessment;
import com.platform.repository.UserRepository;
import com.platform.repository.WeeklyTestRepository;
import com.platform.repository.EngagementRecordRepository;
import com.platform.repository.FeedbackRepository;
import com.platform.repository.SelfAssessmentRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;



@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeeklyTestRepository weeklyTestRepository;

    @Autowired
    private EngagementRecordRepository recordRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private SelfAssessmentRepository selfRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> admin = userRepository.findByEmail("natz@gmail.com");
        if (admin.isEmpty()) {
            User user = User.builder()
                    .name("Institutional Admin")
                    .email("natz@gmail.com")
                    .password(passwordEncoder.encode("natz@21"))
                    .role(Role.ADMIN)
                    .showLeaderboardName(true)
                    .build();
            userRepository.save(user);
            System.out.println(">>> SEED SUCCESS: Administrative access granted for natz@gmail.com");
        }

        // Added persistent teacher for demo
        if (userRepository.findByEmail("rithi@gmail.com").isEmpty()) {
            User teacher = User.builder()
                    .name("Rithi")
                    .email("rithi@gmail.com")
                    .password(passwordEncoder.encode("rithi@21"))
                    .role(Role.TEACHER)
                    .showLeaderboardName(true)
                    .build();
            userRepository.save(teacher);
            System.out.println(">>> SEED SUCCESS: Persistent Teacher rithi@gmail.com created");
        }

        // Added persistent student for demo
        if (userRepository.findByEmail("akash@gmail.com").isEmpty()) {
            User student = User.builder()
                    .name("Akash")
                    .email("akash@gmail.com")
                    .password(passwordEncoder.encode("akash@21"))
                    .role(Role.STUDENT)
                    .showLeaderboardName(true)
                    .build();
            userRepository.save(student);
            System.out.println(">>> SEED SUCCESS: Persistent Student akash@gmail.com created");
            
            // Seed sample data for this student
            User teacher = userRepository.findByEmail("rithi@gmail.com").orElse(null);
            if (teacher != null) {
                // 1. Initial Assessment Protocol
                if (weeklyTestRepository.count() == 0) {
                    String qs = "[{\"id\":101,\"type\":\"MC\",\"text\":\"Primary indicator of cognitive presence?\",\"options\":[\"Attendance\",\"Deep Processing\",\"Silence\",\"Speed\"],\"correctAnswer\":\"Deep Processing\"},{\"id\":102,\"type\":\"TF\",\"text\":\"Social presence is irrelevant in digital classrooms.\",\"correctAnswer\":\"False\"}]";
                    WeeklyTest sample = WeeklyTest.builder()
                        .title("Cognitive Engagement Protocol")
                        .subject("Learning Sciences")
                        .weekNumber(1)
                        .teacher(teacher)
                        .questions(qs)
                        .timeLimit(15)
                        .marksPerQuestion(10)
                        .instructions("Determine the baseline cognitive engagement index for your current phase.")
                        .build();
                    weeklyTestRepository.save(sample);
                }

                // 2. History & Record
                if (recordRepository.count() == 0) {
                    EngagementRecord r1 = EngagementRecord.builder()
                        .student(student)
                        .week(1)
                        .attendance(95.0)
                        .participation(4)
                        .assignmentStatus("COMPLETED")
                        .testScore(90)
                        .testTotalMarks(100)
                        .engagementScore(92.5)
                        .createdAt(LocalDateTime.now())
                        .build();
                    recordRepository.save(r1);
                    
                    Feedback f1 = new Feedback(student, teacher, "Excellent theoretical understanding shown in Week 1. Continue focusing on practical application.");
                    feedbackRepository.save(f1);
                }

                // 3. Self Assessment
                if (selfRepo.count() == 0) {
                    SelfAssessment sa = SelfAssessment.builder()
                        .student(student)
                        .week(1)
                        .participationRating(4)
                        .confidenceRating(5)
                        .comments("I feel confident about the material but need more practice with the software tools.")
                        .submittedAt(LocalDateTime.now())
                        .build();
                    selfRepo.save(sa);
                }
                
                System.out.println(">>> SEED SUCCESS: Demo environment fully populated for Akash");
            }
        }
    }
}
