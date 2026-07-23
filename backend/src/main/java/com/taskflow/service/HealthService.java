package com.taskflow.service;

import com.taskflow.dto.response.HealthStatusResponse;

public interface HealthService {
    HealthStatusResponse checkSystemHealth();
}
