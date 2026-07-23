package com.taskflow.dto.response;

import com.taskflow.enums.Priority;
import com.taskflow.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {

    private String publicId;
    private String name;
    private String code;
    private String description;
    private ProjectStatus status;
    private Priority priority;

    private LocalDate startDate;
    private LocalDate deadline;
    private BigDecimal budget;

    private String managerName;
    private String managerPublicId;
    private String departmentName;
    private String departmentPublicId;

    private int progressPercentage;
    private String healthStatus;
    private int totalTasks;
    private int completedTasks;
    private int memberCount;

    private LocalDateTime createdAt;
}
