package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardChartsResponse {

    private Map<String, Long> projectStatusBreakdown;
    private Map<String, Long> taskStatusBreakdown;
    private Map<String, Long> taskPriorityBreakdown;
    private Map<String, Long> monthlyProductivity;
    private Map<String, Long> departmentPerformance;
}
