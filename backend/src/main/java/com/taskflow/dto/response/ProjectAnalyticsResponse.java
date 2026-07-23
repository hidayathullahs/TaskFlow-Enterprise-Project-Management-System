package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectAnalyticsResponse {

    private String projectPublicId;
    private String projectName;

    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int overdueTasks;

    private double completionPercentage;
    private BigDecimal totalBudget;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;

    private String healthScore;
    private String riskLevel;

    private Map<String, Integer> taskStatusBreakdown;
    private Map<String, Integer> memberTaskDistribution;
}
