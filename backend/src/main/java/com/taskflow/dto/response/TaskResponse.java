package com.taskflow.dto.response;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {

    private String publicId;
    private String taskNumber;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;

    private String projectCode;
    private String projectName;
    private String projectPublicId;

    private String assigneeName;
    private String assigneePublicId;

    private String creatorName;
    private String creatorPublicId;

    private LocalDate dueDate;
    private Integer estimatedHours;
    private Integer loggedHours;

    private int commentsCount;
    private int subtasksCount;

    private LocalDateTime createdAt;
}
