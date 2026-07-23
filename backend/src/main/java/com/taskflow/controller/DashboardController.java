package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.DashboardChartsResponse;
import com.taskflow.dto.response.DashboardStatsResponse;
import com.taskflow.entity.ActivityLog;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard & Executive Analytics", description = "Endpoints for real-time executive dashboard widgets, statistics, and charts.")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get Dashboard KPI Statistics", description = "Fetches key performance indicators: total/active/completed/overdue projects and tasks.")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        String userPublicId = SecurityUtils.getCurrentUserPublicId().orElse(null);
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userPublicId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
    }

    @GetMapping("/charts")
    @Operation(summary = "Get Dashboard Analytics Chart Data", description = "Fetches datasets for status breakdown, priority distribution, sprint velocity, and department performance.")
    public ResponseEntity<ApiResponse<DashboardChartsResponse>> getDashboardCharts() {
        String userPublicId = SecurityUtils.getCurrentUserPublicId().orElse(null);
        DashboardChartsResponse charts = dashboardService.getDashboardCharts(userPublicId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard chart metrics retrieved", charts));
    }

    @GetMapping("/activities")
    @Operation(summary = "Get Recent Activity Audit Trail", description = "Fetches recent system activity log records.")
    public ResponseEntity<ApiResponse<List<ActivityLog>>> getRecentActivities() {
        List<ActivityLog> activities = dashboardService.getRecentActivities();
        return ResponseEntity.ok(ApiResponse.success("Recent activity audit trail retrieved", activities));
    }
}
