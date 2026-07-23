package com.taskflow.service;

import com.taskflow.dto.response.NotificationResponse;
import com.taskflow.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getUserNotifications(String userPublicId);
    long getUnreadCount(String userPublicId);
    void markAsRead(String notificationPublicId);
    void markAllAsRead(String userPublicId);
    void deleteNotification(String notificationPublicId);

    void sendNotification(String userPublicId, String title, String message, NotificationType type, String link);
}
