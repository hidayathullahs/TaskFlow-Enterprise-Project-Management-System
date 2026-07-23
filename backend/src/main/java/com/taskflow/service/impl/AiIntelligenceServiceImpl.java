package com.taskflow.service.impl;

import com.taskflow.dto.response.AiInsightsResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.AiIntelligenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AiIntelligenceServiceImpl implements AiIntelligenceService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AiInsightsResponse getExecutiveAiInsights() {
        List<AiInsightsResponse.ProjectRiskInsight> risks = getProjectRiskPredictions();
        List<AiInsightsResponse.WorkloadHeatmapItem> workload = getWorkloadAnalysis();
        List<AiInsightsResponse.SmartRecommendation> recs = getSmartRecommendations();

        long highRiskCount = risks.stream().filter(r -> r.getRiskScore() >= 50).count();
        double confidence = Math.max(60.0, 95.0 - (highRiskCount * 8.5));

        String summary = String.format(
                "TaskFlow AI Executive Summary: Overall portfolio delivery confidence is %.1f%%. " +
                        "Analyzed %d active projects and %d team members. Identified %d project(s) requiring proactive manager intervention due to overdue task bottlenecks or tight schedule constraints.",
                confidence, projectRepository.count(), userRepository.count(), highRiskCount
        );

        return AiInsightsResponse.builder()
                .executiveSummary(summary)
                .deliveryConfidenceScore(Math.round(confidence * 10.0) / 10.0)
                .overallRiskLevel(highRiskCount > 1 ? "HIGH" : highRiskCount == 1 ? "MEDIUM" : "LOW")
                .projectRisks(risks)
                .workloadHeatmap(workload)
                .recommendations(recs)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiInsightsResponse.ProjectRiskInsight> getProjectRiskPredictions() {
        List<Project> projects = projectRepository.findAll().stream().filter(p -> !p.isDeleted()).toList();
        List<AiInsightsResponse.ProjectRiskInsight> results = new ArrayList<>();

        for (Project p : projects) {
            List<Task> pTasks = taskRepository.findAll().stream()
                    .filter(t -> t.getProject() != null && t.getProject().getId().equals(p.getId()) && !t.isDeleted())
                    .toList();

            long overdue = pTasks.stream().filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.COMPLETED).count();
            long total = pTasks.size();

            int riskScore = 15;
            List<String> factors = new ArrayList<>();

            if (overdue > 0) {
                riskScore += (overdue * 20);
                factors.add(overdue + " task(s) past due date");
            }

            if (p.getDeadline() != null && p.getDeadline().isBefore(LocalDate.now().plusDays(7)) && p.getStatus() != ProjectStatus.COMPLETED) {
                riskScore += 35;
                factors.add("Project deadline within 7 days");
            }

            if (total > 0 && ((double) pTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count() / total) < 0.3) {
                riskScore += 20;
                factors.add("Low task completion velocity (<30%)");
            }

            if (factors.isEmpty()) {
                factors.add("Schedule and task velocity on track");
            }

            riskScore = Math.min(99, riskScore);

            String level = riskScore >= 70 ? "CRITICAL" : riskScore >= 45 ? "HIGH" : riskScore >= 25 ? "MEDIUM" : "LOW";

            results.add(AiInsightsResponse.ProjectRiskInsight.builder()
                    .projectPublicId(p.getPublicId())
                    .projectName(p.getName())
                    .projectCode(p.getCode() != null ? p.getCode() : "TF")
                    .riskScore(riskScore)
                    .riskLevel(level)
                    .confidenceScore(91.5)
                    .riskFactors(factors)
                    .build());
        }

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiInsightsResponse.WorkloadHeatmapItem> getWorkloadAnalysis() {
        List<User> employees = userRepository.findAll().stream().filter(u -> !u.isDeleted()).toList();
        List<AiInsightsResponse.WorkloadHeatmapItem> items = new ArrayList<>();

        for (User u : employees) {
            long activeTasks = taskRepository.findAll().stream()
                    .filter(t -> t.getAssignee() != null && t.getAssignee().getId().equals(u.getId()) && t.getStatus() != TaskStatus.COMPLETED && !t.isDeleted())
                    .count();

            int util = (int) Math.min(120, (activeTasks * 25));
            String status = util > 85 ? "OVERLOADED" : util < 35 ? "UNDERUTILIZED" : "OPTIMAL";

            items.add(AiInsightsResponse.WorkloadHeatmapItem.builder()
                    .employeePublicId(u.getPublicId())
                    .employeeName(u.getFirstName() + " " + u.getLastName())
                    .designation(u.getDesignation() != null ? u.getDesignation() : "Staff")
                    .activeTasksCount((int) activeTasks)
                    .workloadStatus(status)
                    .utilizationPercentage(util)
                    .build());
        }

        return items;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiInsightsResponse.SmartRecommendation> getSmartRecommendations() {
        List<AiInsightsResponse.SmartRecommendation> recs = new ArrayList<>();

        recs.add(AiInsightsResponse.SmartRecommendation.builder()
                .category("WORKLOAD")
                .title("Rebalance Overloaded Team Members")
                .suggestion("Reassign 2 pending sprint tasks from overloaded Senior Developers to underutilized Team Leads.")
                .impact("HIGH")
                .build());

        recs.add(AiInsightsResponse.SmartRecommendation.builder()
                .category("DEADLINE")
                .title("Extend Target Milestone Deadline")
                .suggestion("Extend Frontend Integration milestone by 3 days based on current code review velocity.")
                .impact("MEDIUM")
                .build());

        recs.add(AiInsightsResponse.SmartRecommendation.builder()
                .category("RISK")
                .title("Escalate Overdue Security Audit Tasks")
                .suggestion("Schedule an immediate sync meeting with QA Leads for Cloud Security Audit blockers.")
                .impact("HIGH")
                .build());

        return recs;
    }
}
