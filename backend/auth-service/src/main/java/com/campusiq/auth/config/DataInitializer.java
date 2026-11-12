package com.campusiq.auth.config;

import com.campusiq.auth.model.Role;
import com.campusiq.auth.model.User;
import com.campusiq.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("tester@campusiq.com", "Fullstack Tester", "password123", Role.FACULTY);
        seedUser("admin@campusiq.com", "Admin User", "admin123", Role.ADMIN);
        seedUser("test@campusiq.com", "Test User", "password123", Role.STUDENT);
    }

    private void seedUser(String email, String name, String rawPassword, Role role) {
        userRepository.findByEmailIgnoreCase(email).ifPresentOrElse(
                user -> {
                    boolean updated = false;
                    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
                        user.setPassword(passwordEncoder.encode(rawPassword));
                        updated = true;
                    }
                    if (user.getRole() != role) {
                        user.setRole(role);
                        updated = true;
                    }
                    if (updated) {
                        userRepository.save(user);
                        log.info("Updated demo user: {} with role {}", email, role);
                    }
                },
                () -> {
                    User newUser = User.builder()
                            .email(email.toLowerCase().trim())
                            .name(name)
                            .password(passwordEncoder.encode(rawPassword))
                            .role(role)
                            .createdAt(LocalDateTime.now())
                            .build();
                    userRepository.save(newUser);
                    log.info("Seeded demo user: {} with role {}", email, role);
                }
        );
    }
}
