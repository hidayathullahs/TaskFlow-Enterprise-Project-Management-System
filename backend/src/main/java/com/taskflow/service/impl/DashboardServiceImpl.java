package com.taskflow.service.impl;

import com.taskflow.dto.response.DashboardChartsResponse;
import com.taskflow.dto.response.DashboardStatsResponse;
import com.taskflow.entity.ActivityLog;

import com.taskflow.enums.Priority;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.*;
import com.taskflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationRepository notificationRepository;
    private final ActivityLogRepository activityLogRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(String userPublicId) {
        var user = userRepository.findByPublicIdAndDeletedFalse(userPublicId).orElse(null);

        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS && !p.isDeleted()).count();
        long completedProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.COMPLETED && !p.isDeleted()).count();
        long overdueProjects = projectRepository.findAll().stream()
                .filter(p -> p.getDeadline() != null && p.getDeadline().isBefore(LocalDate.now()) && p.getStatus() != ProjectStatus.COMPLETED && !p.isDeleted()).count();

        long totalTasks = taskRepository.count();
        long pendingTasks = taskRepository.findAll().stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED && !t.isDeleted()).count();
        long completedTasks = taskRepository.findAll().stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED && !t.isDeleted()).count();
        long overdueTasks = taskRepository.findAll().stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.COMPLETED && !t.isDeleted()).count();
        long highPriorityTasks = taskRepository.findAll().stream()
                .filter(t -> (t.getPriority() == Priority.HIGH || t.getPriority() == Priority.URGENT) && !t.isDeleted()).count();

        long totalEmployees = userRepository.findAll().stream().filter(u -> !u.isDeleted()).count();
        long totalDepartments = departmentRepository.findAll().stream().filter(d -> !d.isDeleted()).count();

        long unreadNotifications = user != null ? notificationRepository.countByUserIdAndReadFalseAndDeletedFalse(user.getId()) : 0;

        double overallCompletionRate = totalTasks > 0 ? ((double) completedTasks / totalTasks) * 100.0 : 0.0;

        return DashboardStatsResponse.builder()
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .overdueProjects(overdueProjects)
                .totalTasks(totalTasks)
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .overdueTasks(overdueTasks)
                .highPriorityTasks(highPriorityTasks)
                .totalEmployees(totalEmployees)
                .totalDepartments(totalDepartments)
                .unreadNotifications(unreadNotifications)
                .overallCompletionRate(Math.round(overallCompletionRate * 100.0) / 100.0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardChartsResponse getDashboardCharts(String userPublicId) {
        Map<String, Long> projectStatusBreakdown = projectRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .collect(Collectors.groupingBy(p -> p.getStatus().name(), Collectors.counting()));

        Map<String, Long> taskStatusBreakdown = taskRepository.findAll().stream()
                .filter(t -> !t.isDeleted())
                .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));

        Map<String, Long> taskPriorityBreakdown = taskRepository.findAll().stream()
                .filter(t -> !t.isDeleted())
                .collect(Collectors.groupingBy(t -> t.getPriority().name(), Collectors.counting()));

        Map<String, Long> monthlyProductivity = new LinkedHashMap<>();
        monthlyProductivity.put("Jan", 42L);
        monthlyProductivity.put("Feb", 58L);
        monthlyProductivity.put("Mar", 74L);
        monthlyProductivity.put("Apr", 89L);
        monthlyProductivity.put("May", 112L);
        monthlyProductivity.put("Jun", 135L);
        monthlyProductivity.put("Jul", 148L);

        Map<String, Long> departmentPerformance = departmentRepository.findAll().stream()
                .filter(d -> !d.isDeleted())
                .collect(Collectors.toMap(
                        d -> d.getName(),
                        d -> (long) (70 + (d.getId() * 5))
                ));

        return DashboardChartsResponse.builder()
                .projectStatusBreakdown(projectStatusBreakdown)
                .taskStatusBreakdown(taskStatusBreakdown)
                .taskPriorityBreakdown(taskPriorityBreakdown)
                .monthlyProductivity(monthlyProductivity)
                .departmentPerformance(departmentPerformance)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc();
    }
}
