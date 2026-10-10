package com.taskflow.service;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.request.TaskMoveRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskComment;
import com.taskflow.entity.User;
import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskCommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private UserRepository userRepository;
    @Mock private TaskCommentRepository commentRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;
    private Project sampleProject;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .publicId("usr-sample-001")
                .email("engineer@taskflow.internal")
                .firstName("Ada")
                .lastName("Lovelace")
                .build();

        sampleProject = Project.builder()
                .id(10L)
                .publicId("prj-alpha-001")
                .name("Core Platform Refactor")
                .build();

        sampleTask = Task.builder()
                .id(100L)
                .publicId("tsk-999")
                .title("Implement OAuth2 Federation")
                .description("Integrate Okta and Azure AD SSO")
                .status(TaskStatus.TODO)
                .priority(Priority.HIGH)
                .project(sampleProject)
                .assignee(sampleUser)
                .creator(sampleUser)
                .deleted(false)
                .build();
    }

    @Test
    @DisplayName("Should retrieve task successfully by publicId")
    void testGetTaskByPublicId_Success() {
        when(taskRepository.findByPublicIdAndDeletedFalse("tsk-999")).thenReturn(Optional.of(sampleTask));

        TaskResponse response = taskService.getTaskByPublicId("tsk-999");

        assertNotNull(response);
        assertEquals("tsk-999", response.getPublicId());
        assertEquals("Implement OAuth2 Federation", response.getTitle());
        verify(taskRepository, times(1)).findByPublicIdAndDeletedFalse("tsk-999");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when task not found")
    void testGetTaskByPublicId_NotFound() {
        when(taskRepository.findByPublicIdAndDeletedFalse("tsk-unknown")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskByPublicId("tsk-unknown"));
    }

    @Test
    @DisplayName("Should return all non-deleted tasks")
    void testGetAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));

        List<TaskResponse> tasks = taskService.getAllTasks();

        assertNotNull(tasks);
        assertEquals(1, tasks.size());
        assertEquals("tsk-999", tasks.get(0).getPublicId());
    }

    @Test
    @DisplayName("Should transition task status on move request")
    void testMoveTaskStatus() {
        when(taskRepository.findByPublicIdAndDeletedFalse("tsk-999")).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskMoveRequest moveRequest = new TaskMoveRequest();
        moveRequest.setStatus(TaskStatus.IN_PROGRESS);
        moveRequest.setPosition(1);

        TaskResponse response = taskService.moveTaskStatus("tsk-999", moveRequest);

        assertNotNull(response);
        verify(taskRepository).save(sampleTask);
    }

    @Test
    @DisplayName("Should soft delete task by publicId")
    void testDeleteTask() {
        when(taskRepository.findByPublicIdAndDeletedFalse("tsk-999")).thenReturn(Optional.of(sampleTask));

        taskService.deleteTask("tsk-999");

        assertTrue(sampleTask.isDeleted());
        verify(taskRepository).save(sampleTask);
    }

    @Test
    @DisplayName("Should add comment to task")
    void testAddComment() {
        when(taskRepository.findByPublicIdAndDeletedFalse("tsk-999")).thenReturn(Optional.of(sampleTask));
        when(userRepository.findByPublicId("usr-sample-001")).thenReturn(Optional.of(sampleUser));
        when(commentRepository.save(any(TaskComment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setContent("Architecture review completed with zero findings.");

        CommentResponse commentResponse = taskService.addComment("tsk-999", commentRequest, "usr-sample-001");

        assertNotNull(commentResponse);
        assertEquals("Architecture review completed with zero findings.", commentResponse.getContent());
        verify(commentRepository).save(any(TaskComment.class));
    }
}
