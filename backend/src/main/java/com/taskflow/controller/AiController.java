package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.AiInsightsResponse;
import com.taskflow.service.AiIntelligenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Decision Support & Predictive Analytics Engine", description = "Endpoints for project risk scoring, workload heatmaps, and AI recommendations.")
public class AiController {

    private final AiIntelligenceService aiService;

    @GetMapping("/summary")
    @Operation(summary = "Get AI Executive Summary & Delivery Confidence", description = "Retrieves natural language AI summary and delivery confidence score.")
    public ResponseEntity<ApiResponse<AiInsightsResponse>> getExecutiveSummary() {
        AiInsightsResponse insights = aiService.getExecutiveAiInsights();
        return ResponseEntity.ok(ApiResponse.success("AI Insights retrieved", insights));
    }

    @GetMapping("/project-risk")
    @Operation(summary = "Get Project Risk Predictions", description = "Calculates project risk scores (0-100) and risk factors.")
    public ResponseEntity<ApiResponse<List<AiInsightsResponse.ProjectRiskInsight>>> getProjectRisks() {
        List<AiInsightsResponse.ProjectRiskInsight> risks = aiService.getProjectRiskPredictions();
        return ResponseEntity.ok(ApiResponse.success("Project risk predictions calculated", risks));
    }

    @GetMapping("/workload")
    @Operation(summary = "Get Employee Workload Heat Map", description = "Analyzes employee task loads and detects burnout risk.")
    public ResponseEntity<ApiResponse<List<AiInsightsResponse.WorkloadHeatmapItem>>> getWorkloadHeatmap() {
        List<AiInsightsResponse.WorkloadHeatmapItem> workload = aiService.getWorkloadAnalysis();
        return ResponseEntity.ok(ApiResponse.success("Workload analysis retrieved", workload));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get Smart Action Recommendations", description = "Generates actionable recommendations for workload balancing and risk mitigation.")
    public ResponseEntity<ApiResponse<List<AiInsightsResponse.SmartRecommendation>>> getRecommendations() {
        List<AiInsightsResponse.SmartRecommendation> recs = aiService.getSmartRecommendations();
        return ResponseEntity.ok(ApiResponse.success("Smart recommendations generated", recs));
    }
}
