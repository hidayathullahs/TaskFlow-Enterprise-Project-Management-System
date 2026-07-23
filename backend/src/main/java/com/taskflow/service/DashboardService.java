package com.taskflow.service;

import com.taskflow.dto.response.DashboardChartsResponse;
import com.taskflow.dto.response.DashboardStatsResponse;
import com.taskflow.entity.ActivityLog;

import java.util.List;

public interface DashboardService {
    DashboardStatsResponse getDashboardStats(String userPublicId);
    DashboardChartsResponse getDashboardCharts(String userPublicId);
    List<ActivityLog> getRecentActivities();
}
