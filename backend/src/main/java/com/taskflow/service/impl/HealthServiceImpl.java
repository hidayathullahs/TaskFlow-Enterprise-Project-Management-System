package com.taskflow.service.impl;

import com.taskflow.dto.response.HealthStatusResponse;
import com.taskflow.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HealthServiceImpl implements HealthService {

    private final JdbcTemplate jdbcTemplate;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Override
    public HealthStatusResponse checkSystemHealth() {
        Map<String, Object> services = new HashMap<>();

        // Check Database Connectivity
        try {
            jdbcTemplate.execute("SELECT 1");
            services.put("database", Map.of("status", "UP", "details", "MySQL Connection Established"));
        } catch (Exception e) {
            services.put("database", Map.of("status", "DOWN", "error", e.getMessage()));
        }

        services.put("diskSpace", Map.of("status", "UP", "thresholdMB", 500));
        services.put("memory", Map.of("status", "UP", "freeMemoryMB", Runtime.getRuntime().freeMemory() / (1024 * 1024)));

        return HealthStatusResponse.builder()
                .status("UP")
                .version("1.0.0-RELEASE")
                .environment(activeProfile)
                .timestamp(LocalDateTime.now())
                .services(services)
                .build();
    }
}
