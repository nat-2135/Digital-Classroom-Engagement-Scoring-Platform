package com.platform.config;

import com.platform.models.Role;
import com.platform.models.User;
import com.platform.repository.UserRepository;
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
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.findByEmail("admin@classroom.com").isPresent()) {
            // Create Admin
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@classroom.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .showLeaderboardName(true)
                    .build();
            userRepository.save(admin);

            // Create Students
            User s1 = User.builder()
                    .name("Hemanth Kumar")
                    .email("hemanth@student.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .showLeaderboardName(true)
                    .build();
            userRepository.save(s1);

            User s2 = User.builder()
                    .name("Anand Rao")
                    .email("anand@student.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .showLeaderboardName(true)
                    .build();
            userRepository.save(s2);

            System.out.println(">>> Seed Data: Created Admin and 2 Students.");
        }
    }
}
