package com.taskflow.service;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.request.TaskMoveRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.dto.response.KanbanBoardResponse;
import com.taskflow.dto.response.TaskResponse;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getAllTasks();
    TaskResponse getTaskByPublicId(String publicId);
    List<TaskResponse> getTasksByProject(String projectPublicId);
    TaskResponse createTask(TaskRequest request, String creatorPublicId);
    TaskResponse updateTask(String publicId, TaskRequest request);
    void deleteTask(String publicId);

    TaskResponse moveTaskStatus(String publicId, TaskMoveRequest request);
    KanbanBoardResponse getKanbanBoard(String projectPublicId);

    CommentResponse addComment(String taskPublicId, CommentRequest request, String authorPublicId);
    List<CommentResponse> getTaskComments(String taskPublicId);

    List<TaskResponse> searchTasks(String query, String status, String priority, String projectPublicId);
}
