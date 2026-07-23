package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.NotificationResponse;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Real-Time Notification & Alert Center", description = "Endpoints for user notifications, unread counters, mark as read, and STOMP message fallback.")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get User Notifications", description = "Retrieves listing of user notifications.")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications() {
        String userPublicId = SecurityUtils.getCurrentUserPublicId().orElseThrow();
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userPublicId);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notifications));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get Unread Notification Count", description = "Returns count of unread alert notifications for badge indicator.")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        String userPublicId = SecurityUtils.getCurrentUserPublicId().orElse(null);
        long count = userPublicId != null ? notificationService.getUnreadCount(userPublicId) : 0;
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved", count));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark Notification as Read", description = "Marks a specific notification as read.")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable("id") String publicId) {
        notificationService.markAsRead(publicId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark All Notifications as Read", description = "Marks all notifications as read for current user.")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        String userPublicId = SecurityUtils.getCurrentUserPublicId().orElseThrow();
        notificationService.markAllAsRead(userPublicId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft-Delete Notification", description = "Soft deletes a notification.")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable("id") String publicId) {
        notificationService.deleteNotification(publicId);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }
}
