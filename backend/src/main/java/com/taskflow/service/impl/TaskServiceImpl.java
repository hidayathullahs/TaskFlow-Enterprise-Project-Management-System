package com.taskflow.service.impl;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.request.TaskMoveRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.dto.response.KanbanBoardResponse;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.entity.TaskComment;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskCommentRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskCommentRepository commentRepository;

    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectRepository projectRepository,
                           UserRepository userRepository,
                           TaskCommentRepository commentRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .filter(t -> !t.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskByPublicId(String publicId) {
        Task task = taskRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "publicId", publicId));
        return mapToResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(String projectPublicId) {
        return taskRepository.findAll().stream()
                .filter(t -> t.getProject() != null && t.getProject().getPublicId().equals(projectPublicId) && !t.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, String creatorPublicId) {
        Project project = projectRepository.findByPublicIdAndDeletedFalse(request.getProjectPublicId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "publicId", request.getProjectPublicId()));

        User assignee = null;
        if (request.getAssigneePublicId() != null) {
            assignee = userRepository.findByPublicIdAndDeletedFalse(request.getAssigneePublicId())
                    .orElse(null);
        }

        User creator = null;
        if (creatorPublicId != null) {
            creator = userRepository.findByPublicIdAndDeletedFalse(creatorPublicId).orElse(null);
        }

        long count = taskRepository.count() + 1;
        String taskNumber = "TF-" + (100 + count);

        Task task = Task.builder()
                .taskNumber(taskNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority())
                .project(project)
                .assignee(assignee)
                .creator(creator)
                .dueDate(request.getDueDate())
                .estimatedHours(request.getEstimatedHours() != null ? BigDecimal.valueOf(request.getEstimatedHours()) : BigDecimal.ZERO)
                .actualHours(BigDecimal.ZERO)
                .build();

        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(String publicId, TaskRequest request) {
        Task task = taskRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "publicId", publicId));

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(BigDecimal.valueOf(request.getEstimatedHours()));

        if (request.getAssigneePublicId() != null) {
            User assignee = userRepository.findByPublicIdAndDeletedFalse(request.getAssigneePublicId()).orElse(null);
            task.setAssignee(assignee);
        }

        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTask(String publicId) {
        Task task = taskRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "publicId", publicId));
        task.setDeleted(true);
        taskRepository.save(task);
    }

    @Override
    @Transactional(readOnly = true)
    public KanbanBoardResponse getKanbanBoard(String projectPublicId) {
        List<Task> tasks;
        if (projectPublicId != null && !projectPublicId.trim().isEmpty()) {
            tasks = taskRepository.findAll().stream()
                    .filter(t -> t.getProject() != null && t.getProject().getPublicId().equals(projectPublicId) && !t.isDeleted())
                    .collect(Collectors.toList());
        } else {
            tasks = taskRepository.findAll().stream()
                    .filter(t -> !t.isDeleted())
                    .collect(Collectors.toList());
        }

        Map<TaskStatus, List<TaskResponse>> columns = new EnumMap<>(TaskStatus.class);
        for (TaskStatus status : TaskStatus.values()) {
            columns.put(status, new ArrayList<>());
        }

        for (Task task : tasks) {
            columns.computeIfAbsent(task.getStatus(), k -> new ArrayList<>()).add(mapToResponse(task));
        }

        return KanbanBoardResponse.builder()
                .columns(columns)
                .totalTasks(tasks.size())
                .build();
    }

    @Override
    @Transactional
    public TaskResponse moveTaskStatus(String publicId, TaskMoveRequest request) {
        Task task = taskRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "publicId", publicId));

        if (request.getNewStatus() != null) {
            task.setStatus(request.getNewStatus());
        }

        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CommentResponse addComment(String taskPublicId, CommentRequest request, String userPublicId) {
        Task task = taskRepository.findByPublicIdAndDeletedFalse(taskPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "publicId", taskPublicId));
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(user)
                .commentText(request.getContent())
                .build();

        TaskComment saved = commentRepository.save(comment);

        return CommentResponse.builder()
                .publicId(saved.getPublicId())
                .content(saved.getComment())
                .authorName(user.getFirstName() + " " + user.getLastName())
                .authorPublicId(user.getPublicId())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getTaskComments(String taskPublicId) {
        Task task = taskRepository.findByPublicIdAndDeletedFalse(taskPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "publicId", taskPublicId));

        return commentRepository.findAll().stream()
                .filter(c -> c.getTask() != null && c.getTask().getId().equals(task.getId()) && !c.isDeleted())
                .map(c -> CommentResponse.builder()
                        .publicId(c.getPublicId())
                        .content(c.getComment())
                        .authorName(c.getUser() != null ? c.getUser().getFirstName() + " " + c.getUser().getLastName() : "Anonymous")
                        .authorPublicId(c.getUser() != null ? c.getUser().getPublicId() : null)
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasks(String query, String status, String priority, String projectPublicId) {
        return taskRepository.findAll().stream()
                .filter(t -> !t.isDeleted())
                .filter(t -> {
                    if (query == null || query.trim().isEmpty()) return true;
                    String q = query.toLowerCase();
                    return t.getTitle().toLowerCase().contains(q) ||
                           (t.getDescription() != null && t.getDescription().toLowerCase().contains(q)) ||
                           (t.getTaskNumber() != null && t.getTaskNumber().toLowerCase().contains(q));
                })
                .filter(t -> {
                    if (status == null || status.trim().isEmpty()) return true;
                    return t.getStatus().name().equalsIgnoreCase(status);
                })
                .filter(t -> {
                    if (priority == null || priority.trim().isEmpty()) return true;
                    return t.getPriority().name().equalsIgnoreCase(priority);
                })
                .filter(t -> {
                    if (projectPublicId == null || projectPublicId.trim().isEmpty()) return true;
                    return t.getProject() != null && t.getProject().getPublicId().equals(projectPublicId);
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToResponse(Task task) {
        long commentCount = commentRepository.findAll().stream()
                .filter(c -> c.getTask() != null && c.getTask().getId().equals(task.getId()) && !c.isDeleted())
                .count();

        return TaskResponse.builder()
                .publicId(task.getPublicId())
                .taskNumber(task.getTaskNumber())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .projectCode(task.getProject() != null ? task.getProject().getCode() : null)
                .projectName(task.getProject() != null ? task.getProject().getName() : null)
                .projectPublicId(task.getProject() != null ? task.getProject().getPublicId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getFirstName() + " " + task.getAssignee().getLastName() : "Unassigned")
                .assigneePublicId(task.getAssignee() != null ? task.getAssignee().getPublicId() : null)
                .creatorName(task.getCreator() != null ? task.getCreator().getFirstName() + " " + task.getCreator().getLastName() : "System")
                .creatorPublicId(task.getCreator() != null ? task.getCreator().getPublicId() : null)
                .dueDate(task.getDueDate())
                .estimatedHours(task.getEstimatedHours() != null ? task.getEstimatedHours().intValue() : 0)
                .loggedHours(task.getLoggedHours() != null ? task.getLoggedHours().intValue() : 0)
                .commentsCount((int) commentCount)
                .subtasksCount(task.getSubtasks() != null ? task.getSubtasks().size() : 0)
                .createdAt(task.getCreatedAt())
                .build();
    }
}
