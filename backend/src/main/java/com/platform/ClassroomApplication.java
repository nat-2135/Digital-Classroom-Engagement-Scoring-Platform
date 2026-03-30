package com.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.platform.repository")
public class ClassroomApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClassroomApplication.class, args);
    }
}