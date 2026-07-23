package com.taskflow.dto.request;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Task status is required")
    private TaskStatus status = TaskStatus.TODO;

    private Priority priority = Priority.MEDIUM;

    @NotBlank(message = "Project public ID is required")
    private String projectPublicId;

    private String assigneePublicId;
    private LocalDate dueDate;

    private Integer estimatedHours = 8;
}
