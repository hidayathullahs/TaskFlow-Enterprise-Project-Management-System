package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long overdueProjects;

    private long totalTasks;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks;
    private long highPriorityTasks;

    private long totalEmployees;
    private long totalDepartments;
    private long unreadNotifications;

    private Double overallCompletionRate;
}
