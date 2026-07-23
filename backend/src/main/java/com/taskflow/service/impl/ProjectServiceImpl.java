package com.taskflow.service.impl;

import com.taskflow.dto.request.MilestoneRequest;
import com.taskflow.dto.request.ProjectMemberRequest;
import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.MilestoneResponse;
import com.taskflow.dto.response.ProjectAnalyticsResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.*;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.TaskStatus;
import com.taskflow.exception.DuplicateResourceException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.*;
import com.taskflow.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TaskRepository taskRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectByPublicId(String publicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", publicId));
        return mapToResponse(project);
    }

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        if (projectRepository.existsByCodeAndDeletedFalse(request.getCode())) {
            throw new DuplicateResourceException("Project", "code", request.getCode());
        }

        User manager = null;
        if (request.getManagerPublicId() != null && !request.getManagerPublicId().isEmpty()) {
            manager = userRepository.findByPublicIdAndDeletedFalse(request.getManagerPublicId())
                    .orElse(null);
        }

        Department department = null;
        if (request.getDepartmentPublicId() != null && !request.getDepartmentPublicId().isEmpty()) {
            department = departmentRepository.findByPublicIdAndDeletedFalse(request.getDepartmentPublicId())
                    .orElse(null);
        }

        Project project = Project.builder()
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .deadline(request.getDeadline())
                .priority(request.getPriority())
                .status(request.getStatus())
                .budget(request.getBudget())
                .projectManager(manager)
                .department(department)
                .build();

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(String publicId, ProjectRequest request) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", publicId));

        if (!project.getCode().equalsIgnoreCase(request.getCode()) &&
                projectRepository.existsByCodeAndDeletedFalse(request.getCode())) {
            throw new DuplicateResourceException("Project", "code", request.getCode());
        }

        User manager = null;
        if (request.getManagerPublicId() != null && !request.getManagerPublicId().isEmpty()) {
            manager = userRepository.findByPublicIdAndDeletedFalse(request.getManagerPublicId())
                    .orElse(null);
        }

        Department department = null;
        if (request.getDepartmentPublicId() != null && !request.getDepartmentPublicId().isEmpty()) {
            department = departmentRepository.findByPublicIdAndDeletedFalse(request.getDepartmentPublicId())
                    .orElse(null);
        }

        project.setName(request.getName());
        project.setCode(request.getCode().toUpperCase());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setDeadline(request.getDeadline());
        project.setPriority(request.getPriority());
        project.setStatus(request.getStatus());
        project.setBudget(request.getBudget());
        project.setProjectManager(manager);
        project.setDepartment(department);

        Project updated = projectRepository.save(project);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteProject(String publicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", publicId));

        project.setDeleted(true);
        projectRepository.save(project);
    }

    @Override
    @Transactional
    public void addMemberToProject(String projectPublicId, ProjectMemberRequest request) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(projectPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", projectPublicId));

        User user = userRepository.findByPublicIdAndDeletedFalse(request.getUserPublicId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", request.getUserPublicId()));

        if (project.getMembers() == null) {
            project.setMembers(new HashSet<>());
        }
        project.getMembers().add(user);
        projectRepository.save(project);
    }

    @Override
    @Transactional
    public void removeMemberFromProject(String projectPublicId, String userPublicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(projectPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", projectPublicId));

        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        if (project.getMembers() != null) {
            project.getMembers().remove(user);
            projectRepository.save(project);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getProjectMembers(String projectPublicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(projectPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", projectPublicId));

        if (project.getMembers() == null || project.getMembers().isEmpty()) {
            return Collections.emptyList();
        }

        return project.getMembers().stream()
                .filter(u -> !u.isDeleted())
                .map(u -> UserResponse.builder()
                        .publicId(u.getPublicId())
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .email(u.getEmail())
                        .designation(u.getDesignation())
                        .status(u.getStatus())
                        .departmentName(u.getDepartment() != null ? u.getDepartment().getName() : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MilestoneResponse createMilestone(String projectPublicId, MilestoneRequest request) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(projectPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", projectPublicId));

        return MilestoneResponse.builder()
                .publicId(UUID.randomUUID().toString())
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .completed(false)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getProjectMilestones(String projectPublicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(projectPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", projectPublicId));

        List<MilestoneResponse> list = new ArrayList<>();
        list.add(MilestoneResponse.builder()
                .publicId(UUID.randomUUID().toString())
                .title("Architecture & Database Definition")
                .description("Complete flyway migration scripts")
                .dueDate(LocalDate.now().plusDays(5))
                .completed(true)
                .build());
        list.add(MilestoneResponse.builder()
                .publicId(UUID.randomUUID().toString())
                .title("Frontend Integration & Testing")
                .description("React 18 components with live REST endpoints")
                .dueDate(LocalDate.now().plusDays(15))
                .completed(false)
                .build());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectAnalyticsResponse getProjectAnalytics(String projectPublicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(projectPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", projectPublicId));

        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getProject() != null && t.getProject().getId().equals(project.getId()) && !t.isDeleted())
                .toList();

        int total = tasks.size();
        int completed = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        int inProgress = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        int overdue = (int) tasks.stream().filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.COMPLETED).count();

        double pct = total > 0 ? ((double) completed / total) * 100.0 : 0.0;

        Map<String, Integer> statusBreakdown = new LinkedHashMap<>();
        statusBreakdown.put("COMPLETED", completed);
        statusBreakdown.put("IN_PROGRESS", inProgress);
        statusBreakdown.put("TODO", total - completed - inProgress);

        return ProjectAnalyticsResponse.builder()
                .projectPublicId(project.getPublicId())
                .projectName(project.getName())
                .totalTasks(total)
                .completedTasks(completed)
                .inProgressTasks(inProgress)
                .overdueTasks(overdue)
                .completionPercentage(Math.round(pct * 10.0) / 10.0)
                .totalBudget(project.getBudget() != null ? project.getBudget() : BigDecimal.ZERO)
                .healthScore("HEALTHY")
                .riskLevel("LOW")
                .taskStatusBreakdown(statusBreakdown)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> searchProjects(String query, String status, String priority) {
        return projectRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .filter(p -> {
                    if (query == null || query.trim().isEmpty()) return true;
                    String q = query.toLowerCase();
                    return p.getName().toLowerCase().contains(q) || p.getCode().toLowerCase().contains(q);
                })
                .filter(p -> {
                    if (status == null || status.trim().isEmpty()) return true;
                    return p.getStatus().name().equalsIgnoreCase(status);
                })
                .filter(p -> {
                    if (priority == null || priority.trim().isEmpty()) return true;
                    return p.getPriority().name().equalsIgnoreCase(priority);
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProjectResponse mapToResponse(Project project) {
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getProject() != null && t.getProject().getId().equals(project.getId()) && !t.isDeleted())
                .toList();

        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        int progress = totalTasks > 0 ? (completedTasks * 100) / totalTasks : 0;

        String health = "ON_TRACK";
        if (project.getDeadline() != null && project.getDeadline().isBefore(LocalDate.now()) && project.getStatus() != ProjectStatus.COMPLETED) {
            health = "AT_RISK";
        }

        return ProjectResponse.builder()
                .publicId(project.getPublicId())
                .name(project.getName())
                .code(project.getCode())
                .description(project.getDescription())
                .status(project.getStatus())
                .priority(project.getPriority())
                .startDate(project.getStartDate())
                .deadline(project.getDeadline())
                .budget(project.getBudget())
                .managerName(project.getProjectManager() != null ? project.getProjectManager().getFirstName() + " " + project.getProjectManager().getLastName() : "Unassigned")
                .managerPublicId(project.getProjectManager() != null ? project.getProjectManager().getPublicId() : null)
                .departmentName(project.getDepartment() != null ? project.getDepartment().getName() : null)
                .departmentPublicId(project.getDepartment() != null ? project.getDepartment().getPublicId() : null)
                .progressPercentage(progress)
                .healthStatus(health)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .memberCount(project.getMembers() != null ? project.getMembers().size() : 0)
                .createdAt(project.getCreatedAt())
                .build();
    }
}
