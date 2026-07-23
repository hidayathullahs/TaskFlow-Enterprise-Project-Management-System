package com.taskflow.security;

import com.taskflow.entity.User;
import com.taskflow.enums.UserStatus;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class BruteForceProtectionService {

    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final long LOCK_TIME_DURATION_MINUTES = 15;

    private final UserRepository userRepository;

    @Transactional
    public void loginFailed(User user) {
        int newFailAttempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(newFailAttempts);

        if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
            user.setStatus(UserStatus.SUSPENDED);
            user.setLockTime(LocalDateTime.now());
            log.warn("Account for user {} locked due to {} failed login attempts", user.getEmail(), newFailAttempts);
        }
        userRepository.save(user);
    }

    @Transactional
    public void loginSucceeded(User user) {
        if (user.getFailedLoginAttempts() > 0 || user.getLockTime() != null) {
            user.setFailedLoginAttempts(0);
            user.setLockTime(null);
            if (user.getStatus() == UserStatus.SUSPENDED) {
                user.setStatus(UserStatus.ACTIVE);
            }
            userRepository.save(user);
        }
    }

    public void checkIfAccountIsLocked(User user) {
        if (user.getStatus() == UserStatus.SUSPENDED && user.getLockTime() != null) {
            LocalDateTime lockTime = user.getLockTime();
            if (lockTime.plusMinutes(LOCK_TIME_DURATION_MINUTES).isAfter(LocalDateTime.now())) {
                throw new UnauthorizedException("Your account has been temporarily locked due to 5 consecutive failed login attempts. Please try again after 15 minutes.");
            } else {
                // Auto-unlock after 15 minutes expired
                user.setStatus(UserStatus.ACTIVE);
                user.setFailedLoginAttempts(0);
                user.setLockTime(null);
                userRepository.save(user);
            }
        }
    }
}
