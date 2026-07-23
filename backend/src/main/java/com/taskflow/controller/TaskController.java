package com.taskflow.controller;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.request.TaskMoveRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.dto.response.KanbanBoardResponse;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Enterprise Task & Kanban Board Engine", description = "Endpoints for task management, Kanban status transitions, rich comments, and time tracking.")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get All Tasks", description = "Retrieves directory of all active tasks.")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        List<TaskResponse> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success("Tasks list retrieved", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Task Details by Public ID", description = "Retrieves task metadata, assignee, due date, and logged time.")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable("id") String publicId) {
        TaskResponse task = taskService.getTaskByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved", task));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER', 'ROLE_TEAM_LEAD', 'TASK_CREATE')")
    @Operation(summary = "Create New Task", description = "Creates a new task within a project.")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        String creatorPublicId = SecurityUtils.getCurrentUserPublicId().orElse(null);
        TaskResponse created = taskService.createTask(request, creatorPublicId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Task created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER', 'ROLE_TEAM_LEAD', 'TASK_UPDATE')")
    @Operation(summary = "Update Task Details", description = "Modifies task title, description, priority, status, or assignee.")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable("id") String publicId, @Valid @RequestBody TaskRequest request) {
        TaskResponse updated = taskService.updateTask(publicId, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'TASK_DELETE')")
    @Operation(summary = "Soft-Delete Task", description = "Soft deletes task.")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable("id") String publicId) {
        taskService.deleteTask(publicId);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @PutMapping("/{id}/move")
    @Operation(summary = "Move Task Status in Kanban Column", description = "Persists drag-and-drop or column transition in real time.")
    public ResponseEntity<ApiResponse<TaskResponse>> moveTaskStatus(@PathVariable("id") String publicId, @Valid @RequestBody TaskMoveRequest request) {
        TaskResponse moved = taskService.moveTaskStatus(publicId, request);
        return ResponseEntity.ok(ApiResponse.success("Task moved to " + request.getNewStatus(), moved));
    }

    @GetMapping("/kanban")
    @Operation(summary = "Get Interactive Kanban Board Datasets", description = "Groups active tasks by status columns (TODO, IN_PROGRESS, CODE_REVIEW, COMPLETED).")
    public ResponseEntity<ApiResponse<KanbanBoardResponse>> getKanbanBoard(@RequestParam(required = false) String projectPublicId) {
        KanbanBoardResponse board = taskService.getKanbanBoard(projectPublicId);
        return ResponseEntity.ok(ApiResponse.success("Kanban board dataset retrieved", board));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add Comment to Task", description = "Adds a rich comment or discussion entry to the task.")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(@PathVariable("id") String publicId, @Valid @RequestBody CommentRequest request) {
        String authorPublicId = SecurityUtils.getCurrentUserPublicId().orElse(null);
        CommentResponse comment = taskService.addComment(publicId, request, authorPublicId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Comment added", comment));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Get Task Discussion Comments", description = "Retrieves all comments posted on a task.")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getTaskComments(@PathVariable("id") String publicId) {
        List<CommentResponse> comments = taskService.getTaskComments(publicId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & Filter Tasks", description = "Searches tasks by title/number, status, priority, and project ID.")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> searchTasks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String projectPublicId) {
        List<TaskResponse> results = taskService.searchTasks(query, status, priority, projectPublicId);
        return ResponseEntity.ok(ApiResponse.success("Task search completed", results));
    }
}
