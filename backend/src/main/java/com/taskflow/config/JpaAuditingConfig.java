package com.taskflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
public class JpaAuditingConfig {

    @Bean
    public AuditorAware<Long> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }
            // If custom principal is loaded, return user ID; else empty
            try {
                com.taskflow.security.UserPrincipal principal = (com.taskflow.security.UserPrincipal) authentication.getPrincipal();
                return Optional.ofNullable(principal.getId());
            } catch (Exception e) {
                return Optional.empty();
            }
        };
    }
}
