package com.taskflow.dto.request;

import com.taskflow.enums.Priority;
import com.taskflow.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @NotBlank(message = "Project code is required")
    @Size(max = 30, message = "Code must not exceed 30 characters")
    private String code;

    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate deadline;

    private Priority priority = Priority.MEDIUM;
    private ProjectStatus status = ProjectStatus.PLANNING;

    private BigDecimal budget;
    private String managerPublicId;
    private String departmentPublicId;
}
