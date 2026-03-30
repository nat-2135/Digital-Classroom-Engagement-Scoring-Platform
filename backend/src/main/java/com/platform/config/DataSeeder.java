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
    }
}
