package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.HealthStatusResponse;
import com.taskflow.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Tag(name = "Health & Diagnostics", description = "System health check endpoints")
public class HealthController {

    private final HealthService healthService;

    @GetMapping
    @Operation(summary = "Get System Health Status", description = "Returns system health, active profile, and database readiness status.")
    public ResponseEntity<ApiResponse<HealthStatusResponse>> getHealthStatus() {
        HealthStatusResponse healthStatus = healthService.checkSystemHealth();
        return ResponseEntity.ok(ApiResponse.success("System health diagnostics retrieved successfully", healthStatus));
    }
}
