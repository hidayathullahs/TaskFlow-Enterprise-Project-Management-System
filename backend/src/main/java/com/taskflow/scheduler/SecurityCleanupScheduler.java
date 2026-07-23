package com.taskflow.scheduler;

import com.taskflow.repository.OtpRepository;
import com.taskflow.repository.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityCleanupScheduler {

    private final OtpRepository otpRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Scheduled(cron = "0 0 2 * * ?") // Runs every night at 2:00 AM
    @Transactional
    public void cleanupExpiredSecurityData() {
        log.info("Starting scheduled security cleanup task...");
        LocalDateTime now = LocalDateTime.now();

        try {
            otpRepository.deleteByExpiresAtBefore(now);
            tokenBlacklistRepository.deleteByExpiresAtBefore(now);
            log.info("Security cleanup completed: Expired OTPs and blacklisted tokens purged.");
        } catch (Exception e) {
            log.error("Failed to clean up expired security records: {}", e.getMessage());
        }
    }
}
