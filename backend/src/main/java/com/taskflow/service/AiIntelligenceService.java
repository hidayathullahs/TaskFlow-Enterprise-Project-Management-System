package com.taskflow.service;

import com.taskflow.dto.response.AiInsightsResponse;

import java.util.List;
import java.util.Map;

public interface AiIntelligenceService {
    AiInsightsResponse getExecutiveAiInsights();
    List<AiInsightsResponse.ProjectRiskInsight> getProjectRiskPredictions();
    List<AiInsightsResponse.WorkloadHeatmapItem> getWorkloadAnalysis();
    List<AiInsightsResponse.SmartRecommendation> getSmartRecommendations();
}
