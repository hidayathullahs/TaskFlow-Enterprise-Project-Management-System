package com.taskflow.controller;

import com.taskflow.dto.response.HealthStatusResponse;
import com.taskflow.service.HealthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HealthService healthService;

    @Test
    void testHealthCheckEndpoint() throws Exception {
        HealthStatusResponse mockHealth = HealthStatusResponse.builder()
                .status("UP")
                .version("1.0.0-RELEASE")
                .environment("dev")
                .timestamp(LocalDateTime.now())
                .services(Map.of("database", Map.of("status", "UP")))
                .build();

        Mockito.when(healthService.checkSystemHealth()).thenReturn(mockHealth);

        mockMvc.perform(get("/api/v1/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.environment").value("dev"));
    }
}
