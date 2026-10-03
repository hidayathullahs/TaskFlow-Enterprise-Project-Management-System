package com.taskflow.config;

import com.taskflow.entity.Role;
import com.taskflow.entity.User;
import com.taskflow.enums.RoleType;
import com.taskflow.enums.UserStatus;
import com.taskflow.repository.RoleRepository;
import com.taskflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Roles
        Arrays.stream(RoleType.values()).forEach(roleType -> {
            if (roleRepository.findByName(roleType).isEmpty()) {
                Role role = Role.builder()
                        .name(roleType)
                        .description("System role for " + roleType.name())
                        .build();
                roleRepository.save(role);
                log.info("Initialized system role: {}", roleType);
            }
        });

        // 2. Seed Default Super Admin User
        Set<Role> roles = new HashSet<>(roleRepository.findAll());
        User admin = userRepository.findByEmailAndDeletedFalse("admin@taskflow.com")
                .orElse(User.builder()
                        .firstName("Super")
                        .lastName("Admin")
                        .email("admin@taskflow.com")
                        .status(UserStatus.ACTIVE)
                        .emailVerified(true)
                        .roles(roles)
                        .build());
        admin.setPasswordHash(passwordEncoder.encode("TaskFlow#2026!Secure"));
        admin.setStatus(UserStatus.ACTIVE);
        admin.setRoles(roles);
        userRepository.save(admin);
        log.info("Initialized default Super Admin user: admin@taskflow.com");
    }
}
