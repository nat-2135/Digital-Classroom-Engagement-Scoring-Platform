package com.platform.config;

import com.platform.models.Role;
import com.platform.models.User;
import com.platform.models.WeeklyTest;
import com.platform.repository.UserRepository;
import com.platform.repository.WeeklyTestRepository;
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
            
            // Seed a sample test for this student
            User teacher = userRepository.findByEmail("rithi@gmail.com").orElse(null);
            if (teacher != null && weeklyTestRepository.count() == 0) {
                String qs = "[{\"id\":1,\"type\":\"MC\",\"text\":\"What is the primary indicator of classroom engagement?\",\"options\":[\"Attendance\",\"Silence\",\"Grade Point\",\"Manual Entry\"],\"correctAnswer\":\"Attendance\"},{\"id\":2,\"type\":\"TF\",\"text\":\"Active participation improves student outcomes.\",\"correctAnswer\":\"True\"}]";
                WeeklyTest sample = WeeklyTest.builder()
                    .title("Engagement Foundation Protocol")
                    .subject("Behavioral Analytics")
                    .weekNumber(1)
                    .teacher(teacher)
                    .questions(qs)
                    .timeLimit(15)
                    .marksPerQuestion(10)
                    .instructions("Complete this assessment with scientific precision.")
                    .build();
                weeklyTestRepository.save(sample);
                System.out.println(">>> SEED SUCCESS: Initial Assessment Protocol deployed");
            }
        }
    }
}
