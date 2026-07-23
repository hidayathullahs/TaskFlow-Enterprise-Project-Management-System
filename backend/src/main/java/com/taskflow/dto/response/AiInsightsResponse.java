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
public class AiInsightsResponse {

    private String executiveSummary;
    private double deliveryConfidenceScore;
    private String overallRiskLevel;

    private List<ProjectRiskInsight> projectRisks;
    private List<WorkloadHeatmapItem> workloadHeatmap;
    private List<SmartRecommendation> recommendations;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProjectRiskInsight {
        private String projectPublicId;
        private String projectName;
        private String projectCode;
        private int riskScore; // 0-100
        private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
        private double confidenceScore; // e.g. 92.5%
        private List<String> riskFactors;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WorkloadHeatmapItem {
        private String employeePublicId;
        private String employeeName;
        private String designation;
        private int activeTasksCount;
        private String workloadStatus; // OVERLOADED, OPTIMAL, UNDERUTILIZED
        private int utilizationPercentage;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SmartRecommendation {
        private String category; // WORKLOAD, DEADLINE, BUDGET, RISK
        private String title;
        private String suggestion;
        private String impact; // HIGH, MEDIUM, LOW
    }
}
