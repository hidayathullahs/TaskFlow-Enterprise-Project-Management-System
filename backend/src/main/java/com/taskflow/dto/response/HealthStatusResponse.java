package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthStatusResponse {

    private String status;
    private String version;
    private String environment;
    private LocalDateTime timestamp;
    private Map<String, Object> services;
}
